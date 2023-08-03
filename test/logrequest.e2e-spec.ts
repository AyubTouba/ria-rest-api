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

  it('should return logrequests by webclient given in the param', async ()  => {
    let idWebClient = "5faaad3afbe9733fc493262e";
  const  response = await request(app.getHttpServer())
      .get('/logrequest/' + idWebClient)
      .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
      .expect(200)

      const data = response.body;
      expect(data).toHaveLength(5);
  });

  it('should return bad Request after given wrong id ', async ()  => {
    let idWrongWebClient = "wrongid";
    const  response = await request(app.getHttpServer())
        .get('/logrequest/' + idWrongWebClient)
        .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
        .expect(400)
  
    });

  it('should return only logrequets with final_status equal 400 ', async ()  => {
    let idWebClient = "5faaad3afbe9733fc493262e";
      const  response = await request(app.getHttpServer())
          .get(`/logrequest/${idWebClient}?final_status=400`)
          .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
          .expect(200)
    
          const data = response.body;

          expect(data).toHaveLength(2);
      });
  
   it('should return an empty array after giving a webclient id not authorizate to the user ', async ()  => {
        let idWebClient = "5faaad09fbe9733fc493262d";
          const  response = await request(app.getHttpServer())
              .get('/logrequest/'+idWebClient)
              .set('Authorization', `Bearer ${tokenwithUserRole}`)
              .expect(200)
        
              const data = response.body;
              expect(data).toHaveLength(0);
          });   
          
   it('should return  logrequets grouped by final_status', async ()  => {
            let idWebClient = "5faaad3afbe9733fc493262e";
              const  response = await request(app.getHttpServer())
                  .get(`/logrequest/groupby/${idWebClient}?groupby=final_status`)
                  .set('Authorization', `Bearer ${tokenWorkSpaceUser}`)
                  .expect(200)
            
                  const data = response.body;
        
                  expect(data).toHaveLength(3);
              });
});
