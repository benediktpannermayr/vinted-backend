import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

interface AuthResponseBody {
  accessToken: string;
}

interface ProductResponseBody {
  id: string;
}

interface SearchProfileResponseBody {
  id: string;
  name: string;
  productId: string;
  isActive: boolean;
  refreshIntervalMinutes: number;
}

describe('Search profiles (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  let productId: string;

  const credentials = {
    email: 'search-profiles-e2e@example.com',
    password: 'CorrectPass1',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [credentials.email, 'search-profiles-e2e-other@example.com'],
        },
      },
    });

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials);
    accessToken = (registerResponse.body as AuthResponseBody).accessToken;

    const productResponse = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ title: 'Ralph Lauren Oxford Hemd', brand: 'Ralph Lauren' });
    productId = (productResponse.body as ProductResponseBody).id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [credentials.email, 'search-profiles-e2e-other@example.com'],
        },
      },
    });
    await app.close();
  });

  function authed() {
    const agent = request(app.getHttpServer());
    const auth = (test: request.Test) =>
      test.set('Authorization', `Bearer ${accessToken}`);
    return {
      get: (url: string) => auth(agent.get(url)),
      post: (url: string) => auth(agent.post(url)),
      patch: (url: string) => auth(agent.patch(url)),
      delete: (url: string) => auth(agent.delete(url)),
    };
  }

  it('creates a search profile bound to a product with sensible defaults', async () => {
    const response = await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'Ralph Lauren Hemden', productId, maxPrice: 20 })
      .expect(201);

    const body = response.body as SearchProfileResponseBody;
    expect(body.productId).toBe(productId);
    expect(body.isActive).toBe(true);
    expect(body.refreshIntervalMinutes).toBe(60);
  });

  it('rejects creation without a productId', async () => {
    await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'No product' })
      .expect(400);
  });

  it('rejects a refresh interval below the 15 minute floor', async () => {
    await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'Too frequent', productId, refreshIntervalMinutes: 5 })
      .expect(400);
  });

  it("rejects a search profile pointing at another user's product", async () => {
    const otherUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'search-profiles-e2e-other@example.com',
        password: 'CorrectPass1',
      });
    const otherToken = (otherUser.body as AuthResponseBody).accessToken;

    const otherProduct = await request(app.getHttpServer())
      .post('/products')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: "Other user's product" });
    const otherProductId = (otherProduct.body as ProductResponseBody).id;

    await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'Cross-user attempt', productId: otherProductId })
      .expect(404);
  });

  it('updates and deletes a search profile', async () => {
    const createResponse = await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'Temporary profile', productId });
    const id = (createResponse.body as SearchProfileResponseBody).id;

    const updateResponse = await authed()
      .patch(`/marketplace/search-profiles/${id}`)
      .send({ isActive: false })
      .expect(200);
    expect((updateResponse.body as SearchProfileResponseBody).isActive).toBe(
      false,
    );

    await authed().delete(`/marketplace/search-profiles/${id}`).expect(204);
    await authed().get(`/marketplace/search-profiles/${id}`).expect(404);
  });

  it('lists marketplace listings with pagination metadata', async () => {
    // Not asserting emptiness here: MarketplaceListing is a global table and
    // the background sync cron (see MarketplaceSyncService) may populate it
    // independently of this test run.
    const response = await authed().get('/marketplace/listings').expect(200);
    const body = response.body as {
      items: unknown[];
      total: number;
      page: number;
      pageSize: number;
    };
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(0);
    expect(body.page).toBe(1);
  });
});
