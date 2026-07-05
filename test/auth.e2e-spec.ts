import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

interface AuthResponseBody {
  accessToken: string;
  user: { email: string };
}

interface UserResponseBody {
  email: string;
}

describe('Auth (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  const credentials = {
    email: 'e2e-user@example.com',
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
  });

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: credentials.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: credentials.email } });
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('creates a user and returns an access token without the password hash', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(credentials)
        .expect(201);

      const body = response.body as AuthResponseBody;
      expect(body.accessToken).toEqual(expect.any(String));
      expect(body.user.email).toBe(credentials.email);
      expect(body.user).not.toHaveProperty('password');
    });

    it('rejects a duplicate email with 409', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(credentials)
        .expect(201);

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(credentials)
        .expect(409);
    });

    it('rejects an invalid payload with 400', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ email: 'not-an-email', password: 'short' })
        .expect(400);
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(credentials);
    });

    it('returns an access token for correct credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(credentials)
        .expect(200);

      const body = response.body as AuthResponseBody;
      expect(body.accessToken).toEqual(expect.any(String));
    });

    it('rejects an incorrect password with 401', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: credentials.email, password: 'WrongPassword1' })
        .expect(401);
    });
  });

  describe('GET /users/me', () => {
    it('rejects requests without a bearer token', async () => {
      await request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('returns the current user for a valid token', async () => {
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(credentials);
      const { accessToken } = registerResponse.body as AuthResponseBody;

      const response = await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as UserResponseBody;
      expect(body.email).toBe(credentials.email);
      expect(body).not.toHaveProperty('password');
    });
  });
});
