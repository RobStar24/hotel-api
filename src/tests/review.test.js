const request = require("supertest");
const app = require("../app");

let reviewId;
let token;

beforeAll(async () => {
  const loginBody = {
    email: "fer@gmail.com",
    password: "fernanda123",
  };
  const loginRes = await request(app).post("/users/login").send(loginBody);
  token = loginRes.body.token;
});

test("POST /reviews must create a new review", async () => {
  const body = {
    rating: 4,
    comment: "Great hotel!",
    hotelId: 1,
  };
  const res = await request(app)
    .post("/reviews")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  reviewId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.rating).toBe(body.rating);
  expect(res.body.id).toBeDefined();
});

test("GET /reviews must bring all reviews", async () => {
  const res = await request(app).get("/reviews");
  expect(res.status).toBe(200);
  expect(res.body.results).toBeInstanceOf(Array);
  expect(res.body.total).toBeDefined();
});

test("GET /reviews?hotelId=1 must bring reviews for a specific hotel", async () => {
  const res = await request(app).get("/reviews?hotelId=1");
  expect(res.status).toBe(200);
  expect(res.body.results).toBeInstanceOf(Array);
  expect(res.body.results[0].hotelId).toBe(1);
});

test("PUT /reviews/:id must update a review", async () => {
  const body = {
    rating: 5,
    comment: "Amazing experience!",
  };
  const res = await request(app)
    .put(`/reviews/${reviewId}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.rating).toBe(body.rating);
  expect(res.body.comment).toBe(body.comment);
});

test("DELETE /reviews/:id must delete a review", async () => {
  const res = await request(app)
    .delete(`/reviews/${reviewId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
