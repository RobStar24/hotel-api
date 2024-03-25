const request = require("supertest");
const app = require("../app");

let id;
let token;

test("POST /users must create a new user", async () => {
  const body = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "John123",
    gender: "MALE",
  };
  const res = await request(app).post("/users").send(body);
  id = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.firstName).toBe(body.firstName);
  expect(res.body.id).toBeDefined();
});

test("POST /users/login must login a user", async () => {
  const body = {
    email: "john@example.com",
    password: "John123",
  };
  const res = await request(app).post("/users/login").send(body);
  token = res.body.token;
  expect(res.status).toBe(200);
  expect(res.body.token).toBeDefined();
  expect(res.body.user.email).toBe(body.email);
});

test("GET /users must bring all users", async () => {
  const res = await request(app)
    .get("/users")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("PUT /users/:id must update a user", async () => {
  const body = {
    firstName: "John Whick",
  };
  const res = await request(app)
    .put(`/users/${id}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.firstName).toBe(body.firstName);
});

test("POST /users/login must not login a user with wrong credentials", async () => {
  const body = {
    email: "john@example.com",
    password: "John1234",
  };
  const res = await request(app).post("/users/login").send(body);
  expect(res.status).toBe(401);
});

test("DELETE /users/:id must delete a user", async () => {
  const res = await request(app)
    .delete(`/users/${id}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
