import request from "supertest";
import app from "../serverTestCases.js"; // Adjust the import path as per your project structure

describe("POST /apply-pass", () => {
  it("should successfully apply for a pass and return 200 status", async () => {
    const applicationData = {
      id_number: "334455",
      full_name: "Alice Wonderland",
      imm_status: "Pending",
      type: "Type3",
    };

    const response = await request(app)
      .post("/apply-pass")
      .send(applicationData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Application successful",
    });
  });
    
  it("should return 500 status for simulated server error", async () => {
    const applicationData = {
      id_number: 9999, // This ID simulates a server error
      full_name: "Error Case",
      imm_status: "Error",
      type: "ErrorType",
    };

    const response = await request(app)
      .post("/apply-pass")
      .send(applicationData);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "SOMETHING WENT WRONG",
    });
  });

  // Add more test cases as needed...
});
