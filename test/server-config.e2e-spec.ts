import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Servers web  (e2e)', () => {
  let app: INestApplication;
  let tokenWorkSpaceUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmODA5YmI4MGQ1OTlhMWNhNDc4MDhiMSIsIm9yZ2FuaXphdGlvbiI6IjVmNGQyOGI2Zjg5MThlNTZhOGQyYzNkYyIsInJvbGUiOiJXb3JrU3BhY2VBZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJ3ZWJjbGllbnRzIjpudWxsLCJpYXQiOjE2MDUwMjE0NDZ9.RdVUBWONXKDzxnjeeuFqYYClKmI4jzJZt9TOBKk9dXA';
  let tokenwithUserRole = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmYWFhYzBlZmJlOTczM2ZjNDkzMjYyYSIsIm9yZ2FuaXphdGlvbiI6IjVmNGQyOGI2Zjg5MThlNTZhOGQyYzNkYyIsInJvbGUiOiJVc2VyIiwidXNlcm5hbWUiOiJ1c2VyVHJhY2tlciIsIndlYmNsaWVudHMiOlsiNWY3ODg3MzJhMDc4YjczMjA4NmZmYjEzIl0sImlhdCI6MTYwNTA5NDc3Nn0.nNjK98fzxCT_bFKt7_vE2lTQIalOMilQdm630cq2V_I';
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

  it('should return servers by organization from the token', async ()  => {
  const  response = await request(app.getHttpServer())
      .get('/server')
      .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
      .expect(200)

      const data = response.body;
      expect(data).toHaveLength(2);
  });

  it('should return Forbidden if it doesn\'t find the token ', async ()  => {
    const  response = await request(app.getHttpServer())
        .get('/server')
        .expect(403)
  
    });

  it('should return Forbidden if it doesn\'t has the workSpaceAdmin role   ', async ()  => {
      const  response = await request(app.getHttpServer())
          .get('/server')
          .set('Authorization', `Bearer ${tokenwithUserRole}`)
          .expect(403)
    
      });  

  it('should return a server by the id given in the param', async ()  => {
    let idServer = "5faaac50fbe9733fc493262b";
      const  response = await request(app.getHttpServer())
          .get('/server/'+idServer)
          .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
          .expect(200)
    
          const data = response.body;
          expect(data._id).toEqual(idServer);
      });
  
   it('should return an empty array even the server exist in the database because it\'s not from the same organization ', async ()  => {
        let idServer = "5faaaf48fbe9733fc4932630";
          const  response = await request(app.getHttpServer())
              .get('/server/'+idServer)
              .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
              .expect(200)
        
              const data = response.body;
              expect(data).toHaveLength(0);
          });    
});
