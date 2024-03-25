const request = require("supertest");
const app = require("../app");

let bookingId;
let token;

beforeAll(async () => {
  const loginBody = {
    email: "fer@gmail.com",
    password: "fernanda123",
  };
  const loginRes = await request(app).post("/users/login").send(loginBody);
  token = loginRes.body.token;
});

test("POST /bookings must create a new booking", async () => {
  const body = {
    checkIn: "2023-06-01 00:00:00",
    checkOut: "2023-06-05 00:00:00",
    hotelId: 1,
  };
  const res = await request(app)
    .post("/bookings")
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  bookingId = res.body.id;
  expect(res.status).toBe(201);
  expect(res.body.hotelId).toBe(body.hotelId);
  expect(res.body.id).toBeDefined();
});

test("GET /bookings must bring all bookings", async () => {
  const res = await request(app)
    .get("/bookings")
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body).toBeInstanceOf(Array);
});

test("PUT /bookings/:id must update a booking", async () => {
  const body = {
    checkOut: "2023-06-06T00:00:00.000Z",
  };
  const res = await request(app)
    .put(`/bookings/${bookingId}`)
    .send(body)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(200);
  expect(res.body.checkOut).toBe(body.checkOut);
});

test("DELETE /bookings/:id must delete a booking", async () => {
  const res = await request(app)
    .delete(`/bookings/${bookingId}`)
    .set("Authorization", `Bearer ${token}`);
  expect(res.status).toBe(204);
});
