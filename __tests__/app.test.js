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
                        expect(body.user[0]).toEqual({
                            username: 'lurker',
                            name: 'do_nothing',
                            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                        });
                    });
            });
        });
        describe('ERRORS :(' , () => {
            it('GET : 404 - when given a username that does not exist', () => {
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