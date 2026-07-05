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
  title: string;
  brand: string | null;
  searchProfileCount: number;
  listingCount: number;
}

describe('Products (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;

  const credentials = {
    email: 'products-e2e@example.com',
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
        email: { in: [credentials.email, 'products-e2e-other@example.com'] },
      },
    });

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials);
    accessToken = (registerResponse.body as AuthResponseBody).accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: { in: [credentials.email, 'products-e2e-other@example.com'] },
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

  it('creates a product with zero counts', async () => {
    const response = await authed()
      .post('/products')
      .send({ title: 'Ralph Lauren Oxford Hemd', brand: 'Ralph Lauren' })
      .expect(201);

    const body = response.body as ProductResponseBody;
    expect(body.title).toBe('Ralph Lauren Oxford Hemd');
    expect(body.searchProfileCount).toBe(0);
    expect(body.listingCount).toBe(0);
  });

  it("lists only the current user's products", async () => {
    const response = await authed().get('/products').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(
      (response.body as ProductResponseBody[]).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it('returns 404 when accessing a product owned by another user', async () => {
    const otherUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'products-e2e-other@example.com',
        password: 'CorrectPass1',
      });
    const otherToken = (otherUser.body as AuthResponseBody).accessToken;

    const createResponse = await authed()
      .post('/products')
      .send({ title: 'Private product' });
    const productId = (createResponse.body as ProductResponseBody).id;

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(404);
  });

  it('deleting a product cascades to its search profiles', async () => {
    const productResponse = await authed()
      .post('/products')
      .send({ title: 'To be deleted' });
    const productId = (productResponse.body as ProductResponseBody).id;

    const profileResponse = await authed()
      .post('/marketplace/search-profiles')
      .send({ name: 'Profile for deleted product', productId });
    const profileId = (profileResponse.body as { id: string }).id;

    await authed().delete(`/products/${productId}`).expect(204);
    await authed().get(`/marketplace/search-profiles/${profileId}`).expect(404);
  });

  it('updates a product', async () => {
    const createResponse = await authed()
      .post('/products')
      .send({ title: 'Original title' });
    const productId = (createResponse.body as ProductResponseBody).id;

    const updateResponse = await authed()
      .patch(`/products/${productId}`)
      .send({ title: 'Updated title' })
      .expect(200);

    expect((updateResponse.body as ProductResponseBody).title).toBe(
      'Updated title',
    );
  });
});
