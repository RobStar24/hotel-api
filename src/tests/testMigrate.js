const sequelize = require("../utils/connection");
const request = require("supertest");
const app = require("../app.js");
const User = require("../models/User.js");

const main = async () => {
  try {
    // Acciones a ejecutar antes de los tests
    sequelize.sync();
    const user = {
      firstName: "test",
      lastName: "Doe",
      email: "test@example.com",
      password: "test123",
      gender: "OTHER",
    };
    const testUser = await User.findOne({
      where: { email: "test@example.com" },
    });
    if (!testUser) {
      await request(app).post("/users").send(user);
    }
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
