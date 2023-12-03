import request from "supertest";
import app from "../serverTestCases.js"; 
import mockDatabase from "../serverTestCases.js";;

describe("GET /get_data", () => {
  it("should return application data", async () => {
    const response = await request(app).get("/get_data");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id_number: 1,
        full_name: "John Doe",
        imm_status: "Approved",
        type: "Type1",
      },
      {
        id_number: 2,
        full_name: "Jane Smith",
        imm_status: "Pending",
        type: "Type2",
      },
    ]);
  });

  // Additional tests can be added here if needed
});