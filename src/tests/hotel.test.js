const request = require("supertest");
const app = require("../app.js");

let token;

beforeAll(async () => {
  const res = await request(app).post("/users/login").send({
    email: "test@example.com",
    password: "test123",
  });
  token = res.body.token;
});

test("GET /hotels must bring all hotels", async () => {
  const res = await request(app).get("/hotels");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /hotels must create a new hotel", async () => {
  const body = {
    name: "Gran Plaza",
    description: "Great place to stay",
    Price: 100,
    Address: "Calle Principal, 123",
    lat: 40.7128,
    lon: -74.006,
    cityId: 1,
  };
  const res = await request(app)
    .post("/hotels")
    .set("Authorization", `Bearer ${token}`)
    .send(body);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(body.name);
});

test("DELETE /hotels/:id must delete a hotel", async () => {
  const res = await request(app)
    .delete(`/hotels/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
