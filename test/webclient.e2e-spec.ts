import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('webclient  (e2e)', () => {
  let app: INestApplication;
  let tokenWorkSpaceUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmODA5YmI4MGQ1OTlhMWNhNDc4MDhiMSIsIm9yZ2FuaXphdGlvbiI6IjVmNGQyOGI2Zjg5MThlNTZhOGQyYzNkYyIsInJvbGUiOiJXb3JrU3BhY2VBZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJ3ZWJjbGllbnRzIjpudWxsLCJpYXQiOjE2MDUwMjE0NDZ9.RdVUBWONXKDzxnjeeuFqYYClKmI4jzJZt9TOBKk9dXA';
  let tokenwithUserRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWFhYzBlZmJlOTczM2ZjNDkzMjYyYSIsIm9yZ2FuaXphdGlvbiI6IjVmNGQyOGI2Zjg5MThlNTZhOGQyYzNkYyIsInJvbGUiOiJVc2VyIiwidXNlcm5hbWUiOiJ1c2VyVHJhY2tlciIsIndlYmNsaWVudHMiOlsiNWZhYWFkM2FmYmU5NzMzZmM0OTMyNjJlIl0sImlhdCI6MTYwNTExMTEzMX0.AAXCEAZpZzWo88lsB9GRMAqoDN1NhELmP6T9FGWbNiM';
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

  it('should return webclients by organization from the token', async ()  => {
  const  response = await request(app.getHttpServer())
      .get('/webclient')
      .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
      .expect(200)

      const data = response.body;
      expect(data).toHaveLength(2);
  });

  it('should return one webclient by webclient from the token', async ()  => {
    const  response = await request(app.getHttpServer())
        .get('/webclient')
        .set('Authorization', `Bearer ${tokenwithUserRole}`)
        .expect(200)
  
        const data = response.body;
        expect(data).toHaveLength(1);
    });

  it('should return Forbidden if it doesn\'t find the token ', async ()  => {
    const  response = await request(app.getHttpServer())
        .get('/webclient')
        .expect(403)
    });

  it('should return a weclient by the id given in the param', async ()  => {
    let idWebClient = "5faaad09fbe9733fc493262d";
      const  response = await request(app.getHttpServer())
          .get('/webclient/'+idWebClient)
          .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
          .expect(200)
    
          const data = response.body;
          expect(data._id).toEqual(idWebClient);
      });
    
   it('should return a weclient by the server id given in the query', async ()  => {
        let idServer = "5faaac50fbe9733fc493262b";
          const  response = await request(app.getHttpServer())
              .get('/webclient?server='+idServer)
              .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
              .expect(200)
        
              const data = response.body;
              expect(data[0].server._id).toEqual(idServer);
          });

  it('should return an empty array after giving not authorize webclient to the user ', async ()  => {
        let idWebClient = "5faaad09fbe9733fc493262d";
          const  response = await request(app.getHttpServer())
              .get('/webclient/'+idWebClient)
              .set('Authorization', `Bearer ${tokenwithUserRole}`)
              .expect(200)
        
              const data = response.body;
              expect(data).toHaveLength(0);
          });
});
