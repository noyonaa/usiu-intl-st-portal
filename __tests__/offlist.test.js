import request from "supertest";
import app from "../serverTestCases.js"; // Adjust the import path as per your project structure

describe("GET /get_official_list", () => {
  it("should return the list of officials", async () => {
    const response = await request(app).get("/get_official_list");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        off_id: 1,
        off_name: "Official One",
        off_email: "official1@usiu.ac.ke",
      },
      {
        off_id: 2,
        off_name: "Official Two",
        off_email: "official2@usiu.ac.ke",
      },
    ]);
  }, 30000);

});