import request from "supertest";
import app from "../serverTestCases.js"; // Adjust the import path as per your project structure

describe("POST /update_data", () => {
  it("should update application data and return a success message", async () => {
    const updateData = {
      variable_name: "imm_status",
      variable_value: "Approved",
      id_number: 1,
    };

    const response = await request(app).post("/update_data").send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Status Updated",
    });
  });
});
