const request = require("supertest");
const app = require("../app.js");

let token;
let id;

beforeAll(async () => {
  const res = await request(app).post("/users/login").send({
    email: "test@example.com",
    password: "test123",
  });
  token = res.body.token;
});

test("GET /cities must bring all cities", async () => {
  const res = await request(app).get("/cities");
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("POST /cities must create a new city", async () => {
  const body = {
    name: "Cordoba",
    country: "Argentina",
    countryId: "AR",
  };

  const res = await request(app)
    .post("/cities")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.id).toBeDefined();
  expect(res.body.name).toBe(body.name);
});

test("DELETE /cities/:id must delete a city", async () => {
  const res = await request(app)
    .delete(`/cities/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
