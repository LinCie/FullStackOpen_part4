const mongoose = require("mongoose");
const supertest = require("supertest");

const app = require("../app");

const api = supertest(app);

const User = require("../models/User");
const usersList = require("./lists/usersList");

beforeEach(async () => {
  await User.deleteMany({});

  const firstUser = new User(usersList.initialUser);

  await firstUser.save();
});

describe("Sign In", () => {
  it("can sign in", async () => {
    const response = await api.post("/api/users").send(usersList.newUser);
    expect(response.status).toBe(201);
  });

  describe("Validation Test", () => {
    it("rejects when username is missing", async () => {
      const newUser = usersList.newUser;
      delete newUser.username;

      const response = await api.post("/api/users").send(newUser);
      expect(response.status).toBe(400);
    });

    it("rejects when name is missing", async () => {
      const newUser = usersList.newUser;
      delete newUser.name;

      const response = await api.post("/api/users").send(newUser);
      expect(response.status).toBe(400);
    });

    it("rejects when password is missing", async () => {
      const newUser = usersList.newUser;
      delete newUser.password;

      const response = await api.post("/api/users").send(newUser);
      expect(response.status).toBe(400);
    });

    it("rejects when username already exist", async () => {
      const response = await api.post("/api/users").send(usersList.initialUser);
      expect(response.status).toBe(400);
    });

    it("rejects when username is less than three characters long", async () => {
      const newUser = usersList.newUser;
      newUser.username = "12";

      const response = await api.post("/api/users").send(newUser);
      expect(response.status).toBe(400);
    });

    it("rejects when password is less than three characters long", async () => {
      const newUser = usersList.newUser;
      newUser.password = "12";

      const response = await api.post("/api/users").send(newUser);
      expect(response.status).toBe(400);
    });
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
