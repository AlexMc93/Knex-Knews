process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

afterAll(() => {
   return connection.destroy()
})

beforeEach(() => {
    return connection.seed.run()
})

describe('/invalidRoute', () => {
    it('any method : 404 - invalid route', () => {
        const getReq = request(app)
                        .get('/thisIsNotAValidRoute')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Route not found')
                        });

        const delReq = request(app)
                        .del('/alsoNotAValidRoute')
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Route not found')
                        });
        return Promise.all([getReq, delReq]);
    });
});

describe('/api/topics', () => {
    describe('HAPPY PATH :)', () => {
        it('GET : 200 - response with an array of topics', () => {
            return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({ body }) => {
                    expect(body.topics.length).toBe(3);
                    expect(body.topics[0]).toEqual(expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                    }));
                });
        });
    });
    describe('ERRORS :(', () => {
        it('INVALID METHOD (delete) : 405 - delete request responds with appropriate message', () => {
            return request(app)
                .del('/api/topics')
                .expect(405)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not allowed - invalid request method')
                })
        });
        it('INVALID METHOD (patch) : 405 - patch request responds with appropriate message', () => {
            return request(app)
                .patch('/api/topics')
                .expect(405)
                .then(({ body }) => {
                    expect(body.msg).toBe('Not allowed - invalid request method')
                })
        })
    })
});

describe('/api/users', () => {
    describe('/:username', () => {
        describe('HAPPY PATH :)', () => {
            it('GET : 200 - responds with the specified user', () => {
                return request(app)
                    .get('/api/users/lurker')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body.user).toEqual({
                            username: 'lurker',
                            name: 'do_nothing',
                            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                        });
                    });
            });
        });
        describe('ERRORS :(' , () => {
            it('GET : 404 - when given a valid username that does not exist', () => {
                return request(app)
                    .get('/api/users/iAmNotAUser')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toBe('User iAmNotAUser not found')
                    })
            });
            it('INVALID METHOD (delete) : 405 - delete request responds with appropriate message', () => {
                return request(app)
                    .del('/api/users/lurker')
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Not allowed - invalid request method')
                    })
            });
            it('INVALID METHOD (patch) : 405 - patch request responds with appropriate message', () => {
                return request(app)
                    .patch('/api/users/lurker')
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Not allowed - invalid request method')
                    })
            });
        });
    });
});

describe('/api/articles', () => {
    describe('/:article_id', () => {
        describe('HAPPY PATH :)', () => {
            it('GET : 200 - responds with the specified article object', () => {
                return request(app)
                    .get('/api/articles/1')
                    .expect(200)
                    .then(({ body }) => {
                        expect(body).toEqual({
                            article: {
                                author: "butter_bridge",
                                title: "Living in the shadow of a great man",
                                article_id: 1,
                                body: "I find this existence challenging",
                                topic: "mitch",
                                created_at: "2018-11-15T12:21:54.171Z",
                                votes: 100,
                                comment_count: "13",
                            }
                        });
                    });
            });
            it('DELETE : 204 - no content upon successful deletion, also deletes associated comments', () => {
                const deleted = request(app)
                                .del('/api/articles/1')
                                .expect(204)

                const notFound = request(app)
                                  .get('/api/articles/1')
                                  .expect(404)
                                  .then(({ body }) => {
                                      expect(body.msg).toBe('Article ID 1 not found')
                                  });

                // NEED TO ADD IN AN ASSERTION HERE FOR COMMENTS DELETED AFTER PATH IS MADE
                
                return Promise.all([deleted, notFound]);
            });
            it('PATCH : 200 - responds with the updated article after incrementing the votes property by the amount specified in the request body', () => {
                return request(app)
                        .patch('/api/articles/1')
                        .send({inc_votes: 1})
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.article).toEqual({
                                author: "butter_bridge",
                                title: "Living in the shadow of a great man",
                                article_id: 1,
                                body: "I find this existence challenging",
                                topic: "mitch",
                                created_at: "2018-11-15T12:21:54.171Z",
                                votes: 101
                                //comment_count: "13",  <--- not sure if this property is needed? 
                            });
                        });
            });
            it('PATCH : 200 - also works appropriately when given a negative number as the value of inc_votes, and ignores other properties on the request body', () => {
                return request(app)
                        .patch('/api/articles/1')
                        .send({inc_votes: -1, hello: 500})
                        .expect(200)
                        .then(({ body }) => {
                            expect(body.article).toEqual({
                                author: "butter_bridge",
                                title: "Living in the shadow of a great man",
                                article_id: 1,
                                body: "I find this existence challenging",
                                topic: "mitch",
                                created_at: "2018-11-15T12:21:54.171Z",
                                votes: 99,
                                //comment_count: "13",
                            });
                        });
            });
        });
        describe('ERRORS :(', () => {
            it('GET : 404 - when given a valid article_id that does not exist', () => {
                return request(app)
                    .get('/api/articles/9999999')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.msg).toEqual('Article ID 9999999 not found')
                    });
            });
            it('GET : 400 - when given an invalid article_id', () => {
                return request(app)
                    .get('/api/articles/notAnArticleId')
                    .expect(400)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Bad request - please try something else!')
                    });
            });
            it('POST : 405 - invalid method', () => {
                return request(app)
                    .post('/api/articles/1')
                    .send({})
                    .expect(405)
                    .then(({ body }) => {
                        expect(body.msg).toBe('Not allowed - invalid request method')
                    });
            });
            it('PATCH : 404 - when given a valid article_id that does not exist', () => {
                return request(app)
                        .patch('/api/articles/9999')
                        .send({inc_votes: 1})
                        .expect(404)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Article ID 9999 not found')
                        })
            });
            it('PATCH : 400 - when given an invalid article_id', () => {
                return request(app)
                        .patch('/api/articles/thisIsNotAnId')
                        .send({inc_votes: 1})
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Bad request - please try something else!')
                        })
            });
            xit('PATCH : 400 - when request body does not have inc_votes property', () => {
                return request(app)
                        .patch('/api/articles/1')
                        .send({hello: 5})
                        .expect(400)
                        .then(({ body }) => {
                            expect(body.msg).toBe('Bad request - please try something else!')
                        })
            });
            xit('PATCH : 400 - when inc_votes is an invalid value', () => {

            });
        });
    });
});