import request from 'supertest';


describe('GET /api/comments', () => {
  it('should return ok:true and data array when post_id provided', async () => {
    const res = await request('http://localhost:3000').get('/api/comments').query({ post_id: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok');
    expect(res.body.ok).toBe(true);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  }, 20000);
});
