import request from "supertest";
import app from "../serverTestCases.js"; // Adjust the import path as per your project structure

describe("POST /signup-student", () => {
  it("should successfully create a new student and return 200 status", async () => {
    const studentData = {
      full_name: "John Doe",
      id_number: 123456,
      email: "johndoe@usiu.acke",
      password: "password123",
    };

    const response = await request(app)
      .post("/signup-student")
      .send(studentData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Success",
      id: studentData.id_number,
    });
  });

  it("should return 401 status for duplicate ID or email", async () => {
    const studentData = {
      full_name: "Jane Doe",
      id_number: 123456, // Using the same ID as in the previous test
      email: "janedoe@usiu.ac.ke",
      password: "password123",
    };

    const response = await request(app)
      .post("/signup-student")
      .send(studentData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Server Error",
    });
  });

  // Add more tests as needed...
});
