import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
 beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  })

  it('should authenticates user with valid credentials and provides a jwt token', async ()  => {
  const  response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'root', password: 'admin' })
      .expect(202)

      const jwtToken = response.body.token;
      expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
  });

  it('fails to authenticate user with an incorrect password', async ()  => {
    const  response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ username: 'root', password: 'wrong' })
            .expect(401)
  
                expect(response.body.token).not.toBeDefined()
        });

    it('fails to authenticate user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'nobody@example.com', password: 'test' })
          .expect(401)

        expect(response.body.token).not.toBeDefined()
      })
  
  
});
