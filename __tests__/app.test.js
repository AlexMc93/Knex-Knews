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
                            comment_count: 13,
                        }
                    });
                });
            });
            it('DELETE : 204 - no content upon successful deletion, also deletes associated comments (cascades)', () => {
                const deleted = request(app)
                    .del('/api/articles/1')

                const notFound = connection
                    .select('*')
                    .from('articles')
                    .where('article_id', '=', 1)

                const noComments = connection
                    .select('*')
                    .from('comments')
                    .where('article_id', '=', 1)
                
                return deleted
                .then((deleteResponse) => {
                    expect(deleteResponse.statusCode).toBe(204)
                    return notFound
                })
                .then((articleResponse) => {
                    expect(articleResponse.length).toBe(0)
                    return noComments
                })
                .then((commentResponse) => {
                    expect(commentResponse.length).toBe(0)
                });
            });
            it('PATCH : 200 - responds with the updated article after incrementing the votes property by the amount specified in the request body', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 10})
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 110
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
                        votes: 99
                    });
                });
            });
            it('PATCH : 200 - request with no information in the body responds with the unchanged article', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(200)
                .then(({ body }) => {
                    expect(body.article).toEqual({
                        author: "butter_bridge",
                        title: "Living in the shadow of a great man",
                        article_id: 1,
                        body: "I find this existence challenging",
                        topic: "mitch",
                        created_at: "2018-11-15T12:21:54.171Z",
                        votes: 100
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
            it('PATCH : 400 - when inc_votes is an invalid value', () => {
                return request(app)
                .patch('/api/articles/1')
                .send({inc_votes: 'invalid value'})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request - please try something else!')
                })
            });
            it('DELETE : 404 - when given a valid article_id that does not exist', () => {
                return request(app)
                .del('/api/articles/99999')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Article ID 99999 not found')
                });
            });
            it('DELETE : 400 - when given invalid article_id', () => {
                return request(app)
                .del('/api/articles/thisIsNotAnId')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad request - please try something else!')
                })
            });
        });
    });
});

describe('/api/articles/:article_id/comments', () => {
    describe('HAPPY PATH :)', () => {
        it('POST : 201 - responds with the newly posted comment', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'lurker',
                body: 'This is a successful comment'
            })
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    author: 'lurker',
                    body: 'This is a successful comment',
                    article_id: 1,
                    votes: 0,
                    created_at: expect.any(String),
                    comment_id: expect.any(Number)
                });
            });
        });
        it('GET : 200 - responds with an array of comments for specified article_id', () => {
            return request(app)
            .get('/api/articles/6/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments.length).toBe(1)
                expect(body.comments[0]).toEqual({
                    comment_id: 16,
                    body: 'This is a bad article name',
                    article_id: 6,
                    author: 'butter_bridge',
                    votes: 1,
                    created_at: expect.any(String)
                })
            })
        });
        it('GET : 200 - responds with an empty array when the specified article exists but it has no associated comments', () => {
            return request(app)
            .get('/api/articles/7/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual({
                    comments: []
                })
            })
        })
        it('GET : 200 - default response is sorted by created_at in descending order', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy('created_at', {
                    descending: true
                });
            });
        });
        it('GET : 200 - sort_by query allows results to be sorted by other valid column names (eg. author)', () => {
            return request(app)
            .get('/api/articles/1/comments?sort_by=author')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy('author', {
                    descending: true
                });
            });
        });
        it('GET : 200 - order can be specified as `asc` so the response is in ascending order', () => {
            return request(app)
            .get('/api/articles/1/comments?order=asc')
            .expect(200)
            .then(({ body: { comments } }) => {
                expect(comments).toBeSortedBy('created_at')
            })
        })
    });
    describe('ERRORS :(', () => {
        it('POST : 404 - when given a valid article_id that does not exist', () => {
            return request(app)
            .post('/api/articles/99999/comments')
            .send({
                username: 'lurker',
                body: 'This is valid comment on an ID that does not exist'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found')
            })
        });
        it('POST : 400 - when given an invalid article_id', () => {
            return request(app)
            .post('/api/articles/thisIsNotAnArticle/comments')
            .send({
                username: 'lurker',
                body: 'This is a comment on an invalid ID'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('POST : 404 - when given a username that does not exist', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'thisIsNotAValidUsername',
                body: 'Oh dear, this is not going to work'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User not found')
            })
        });
        it('POST : 400 - when comment body is empty or does not exist', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send({
                username: 'lurker',
                thereIsNoBody: 'What happens now?'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('POST : 400 - when req.body is malformed', () => {
            return request(app)
            .post('/api/articles/1/comments')
            .send([])
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('GET : 404 - when given a valid article_id that does not exist', () => {
            return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found')
            })
        });
        it('GET : 400 - when given an invalid article_id', () => {
            return request(app)
            .get('/api/articles/thisIsNotAnID')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('GET : 400 - when given an invalid column name to sort by', () => {
            return request(app)
            .get('/api/articles/1/comments?sort_by=invalidColumnName')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            });
        });
        it('GET : 400 - when given an invalid order value', () => {
            return request(app)
            .get('/api/articles/1/comments?order=thisIsNotValid')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Order must be equal to `asc` or `desc`')
            })
        });
        it('INVALID METHOD : 405 - for del/patch', () => {
            return request(app)
            .del('/api/articles/1/comments')
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe('Not allowed - invalid request method')
            });
        });
    });
});

describe('/api/articles', () => {
    describe('HAPPY PATH :)', () => {
        it('GET : 200 - responds with an array of all articles', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(12)
                expect(articles[0]).toEqual({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number),
                    body: expect.any(String)
                });
            });
        });
        it('GET : 200 - default response is sorted by created_at in descending order', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('created_at', {
                    descending: true
                })
            });
        });
        it('GET : 200 - sort_by query allows response to be sorted by other valid column names', () => {
            return request(app)
            .get('/api/articles?sort_by=votes')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('votes', {
                    descending: true
                });
            });
        });
        it('GET : 200 - order can be specified as `asc` so response is in ascending order', () => {
            return request(app)
            .get('/api/articles?sort_by=votes&order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles).toBeSortedBy('votes')
            });
        });
        it('GET : 200 - including author in query means response is appropriately filtered', () => {
            return request(app)
            .get('/api/articles?author=butter_bridge')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(3)
                expect(articles[0].author).toBe('butter_bridge')
            });
        });
        it('GET : 200 - including topic in query means response is appropriately filtered', () => {
            return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(1)
                expect(articles[0].topic).toBe('cats')
            });
        });
        it('GET : 200 - can chain multiple queries together to get a very specific response', () => {
            return request(app)
            .get('/api/articles?topic=mitch&author=rogersop&sort_by=title&order=asc')
            .expect(200)
            .then(({ body: { articles } }) => {
                expect(articles.length).toBe(2)
                expect(articles).toBeSortedBy('title')
                expect(articles[0].topic).toBe('mitch')
                expect(articles[0].author).toBe('rogersop')
            });
        });
        it('GET : 200 - responds with an empty array when given a valid query (topic/author exists) but there are no associated articles', () => {
            return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
                expect(body.articles).toEqual([])
            })
        });
        it('POST : 201 - responds with the newly created article (including article_id, votes set to 0 and created_at timestamp)', () => {
            return request(app)
            .post('/api/articles')
            .send({
                title: 'test article',
                topic: 'paper',
                author: 'lurker',
                body: 'hello hello hello'
            })
            .expect(201)
            .then(({ body }) => {
                expect(body.article).toEqual({
                    article_id: expect.any(Number),
                    title: 'test article',
                    topic: 'paper',
                    author: 'lurker',
                    body: 'hello hello hello',
                    votes: 0,
                    created_at: expect.any(String)
                });
            });
        });
    });
    describe('ERRORS :(', () => {
        it('GET : 400 - when given an invalid column name to sort by', () => {
            return request(app)
            .get('/api/articles?sort_by=invalidColumnName')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            });
        });
        it('GET : 400 - when given an invalid order value', () => {
            return request(app)
            .get('/api/articles?order=thisIsAlsoNotValid')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Order must be equal to `asc` or `desc`')
            });
        });
        it('GET : 404 - when given an author that does not exist', () => {
            return request(app)
            .get('/api/articles?author=thisIsNotValid')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User thisIsNotValid not found')
            })
        });
        it('GET : 404 - when given a topic that does not exist', () => {
            return request(app)
            .get('/api/articles?topic=thisIsAlsoNotValid')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Topic thisIsAlsoNotValid not found')
            });
        });
        it('POST : 400 - when given a malformed body or missing one of the required properties', () => {
            return request(app)
            .post('/api/articles')
            .send({
                title: 'testing',
                topic: 'paper',
                user: 'lurker',
                ohNo: 'where is the body?'
            })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            });
        });
        it('POST : 404 - when given a topic that does not exist', () => {
            return request(app)
            .post('/api/articles')
            .send({
                title: 'another test',
                topic: 'javascript',
                author: 'lurker',
                body: 'this will not work!'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Topic not found')
            });
        });
        it('POST : 404 - when given a user that does not exist', () => {
            return request(app)
            .post('/api/articles')
            .send({
                title: 'yes its yet another test',
                topic: 'paper',
                author: 'this is not a real user',
                body: 'super cool article stuff'
            })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User not found')
            });
        });
        it('INVALID METHODS : 405 - for del/patch', () => {
            return request(app)
            .patch('/api/articles')
            .send({hello: 'this should result in a 405'})
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe('Not allowed - invalid request method')
            });
        });
    });
});

describe('/api/comments/:comment_id', () => {
    describe('HAPPY PATH :)', () => {
        it('PATCH : 200 - responds with the updated comment', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes: 10})
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 9,
                    author: 'butter_bridge',
                    votes: 26,
                    created_at: expect.any(String)
                });
            });
        });
        it('PATCH : 200 - works appropriately for negative inc_votes and also ignores other properties on request body', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes: -10, hello: 1000})
            .expect(200)
            .then(({ body }) => {
                expect(body.comment).toEqual({
                    comment_id: 1,
                    body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    article_id: 9,
                    author: 'butter_bridge',
                    votes: 6,
                    created_at: expect.any(String)
                });
            });
        });
        it('DELETE : 204 - no content upon successful deletion', () => {
            const deleted = request(app)
            .del('/api/comments/1')
            .expect(204)

            const notFound = request(app)
            .patch('/api/comments/1')
            .send({inc_votes: 1})
            .expect(404)
            
            return Promise.all([deleted, notFound])
        })
    });
    describe('ERRORS :(', () => {
        it('PATCH : 404 - when given a valid comment id that does not exist', () => {
            return request(app)
            .patch('/api/comments/99999')
            .send({inc_votes: 10})
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found')
            })
        });
        it('PATCH : 400 - when given an invalid comment id', () => {
            return request(app)
            .patch('/api/comments/thisIsNotAnID')
            .send({inc_votes: 10})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('PATCH : 400 - when there is no inc_votes property sent', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({changeVotesBy: 10})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('PATCH : 400 - when the value for inc_votes is invalid', () => {
            return request(app)
            .patch('/api/comments/1')
            .send({inc_votes: 'invalid'})
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            });
        });
        it('DELETE : 404 - when given a valid comment id that does not exist', () => {
            return request(app)
            .del('/api/comments/99999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found')
            });
        });
        it('DELETE : 400 - when given an invalid comment id', () => {
            return request(app)
            .del('/api/comments/thisIsDefinitelyNotValid')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad request - please try something else!')
            })
        });
        it('INVALID METHODS : 405 - for post', () => {
            return request(app)
            .post('/api/comments/20')
            .send({newCommentStuff: 'blahblah'})
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe('Not allowed - invalid request method')
            })
        })
    });
});

describe('/api', () => {
    describe('HAPPY PATH :)', () => {
        it('GET : 200 - responds with a JSON describing all available endpoints on the API', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body.endpoints).toHaveProperty('GET /api')
                expect(body.endpoints).toHaveProperty('GET /api/topics')
            })
        })
    });
    describe('ERRORS :(', () => {
        it('INVALID METHODS : 405 - for del/patch/post', () => {
            return request(app)
            .del('/api')
            .expect(405)
            .then(({ body }) => {
                expect(body.msg).toBe('Not allowed - invalid request method')
            })
        })
    });
})