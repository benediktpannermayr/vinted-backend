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

interface ItemResponseBody {
  id: string;
  status: string;
  profit: number | null;
  margin: number | null;
}

describe('Items (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;

  const credentials = {
    email: 'items-e2e-user@example.com',
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
        email: { in: [credentials.email, 'items-e2e-other@example.com'] },
      },
    });

    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(credentials);
    accessToken = (registerResponse.body as AuthResponseBody).accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: credentials.email } });
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

  it('rejects unauthenticated requests', async () => {
    await request(app.getHttpServer()).get('/items').expect(401);
  });

  it('creates an item, which also creates a linked purchase record', async () => {
    const response = await authed()
      .post('/items')
      .send({
        title: 'Ralph Lauren Oxford Hemd',
        brand: 'Ralph Lauren',
        purchasePrice: 8.5,
        purchaseDate: '2026-06-01',
      })
      .expect(201);

    const body = response.body as ItemResponseBody;
    expect(body.status).toBe('IN_STOCK');
    expect(body.profit).toBeNull();

    const purchases = await prisma.purchase.findMany({
      where: { itemId: body.id },
    });
    expect(purchases).toHaveLength(1);
    expect(Number(purchases[0].price)).toBe(8.5);
  });

  it('rejects an item without a purchase price', async () => {
    await authed().post('/items').send({ title: 'Missing price' }).expect(400);
  });

  it("lists only the current user's items", async () => {
    const response = await authed().get('/items').expect(200);
    const body = response.body as { items: ItemResponseBody[]; total: number };
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it('selling an item creates a linked sale record and computes profit', async () => {
    const createResponse = await authed().post('/items').send({
      title: 'Sell me',
      purchasePrice: 10,
      purchaseDate: '2026-06-01',
    });
    const itemId = (createResponse.body as ItemResponseBody).id;

    const sellResponse = await authed()
      .post(`/items/${itemId}/sell`)
      .send({ soldPrice: 30, soldDate: '2026-06-15' })
      .expect(201);

    const body = sellResponse.body as ItemResponseBody;
    expect(body.status).toBe('SOLD');
    expect(body.profit).toBe(20);

    const sales = await prisma.sale.findMany({ where: { itemId } });
    expect(sales).toHaveLength(1);
  });

  it('returns 404 when accessing an item that does not belong to the user', async () => {
    const otherUser = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'items-e2e-other@example.com', password: 'CorrectPass1' });
    const otherToken = (otherUser.body as AuthResponseBody).accessToken;

    const createResponse = await authed().post('/items').send({
      title: 'Private item',
      purchasePrice: 5,
      purchaseDate: '2026-06-01',
    });
    const itemId = (createResponse.body as ItemResponseBody).id;

    await request(app.getHttpServer())
      .get(`/items/${itemId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(404);

    await prisma.user.deleteMany({
      where: { email: 'items-e2e-other@example.com' },
    });
  });

  it('bulk-updates the status of multiple items', async () => {
    const first = await authed()
      .post('/items')
      .send({ title: 'Bulk 1', purchasePrice: 5, purchaseDate: '2026-06-01' });
    const second = await authed()
      .post('/items')
      .send({ title: 'Bulk 2', purchasePrice: 5, purchaseDate: '2026-06-01' });

    const ids = [
      (first.body as ItemResponseBody).id,
      (second.body as ItemResponseBody).id,
    ];

    const response = await authed()
      .patch('/items/bulk-update')
      .send({ ids, status: 'RESERVED' })
      .expect(200);

    expect((response.body as { updated: number }).updated).toBe(2);
  });

  it('deletes an item', async () => {
    const createResponse = await authed().post('/items').send({
      title: 'Delete me',
      purchasePrice: 5,
      purchaseDate: '2026-06-01',
    });
    const itemId = (createResponse.body as ItemResponseBody).id;

    await authed().delete(`/items/${itemId}`).expect(204);
    await authed().get(`/items/${itemId}`).expect(404);
  });
});
