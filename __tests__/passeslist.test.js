const { describe, it, expect, jest } = require("@jest/globals");
const { JSDOM } = require("jsdom");
require('text-encoding');

// Set up jsdom
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe("passeslist", () => {
    describe("load_data function", () => {
        it("should load data and update the results_body", async () => {
            const openMock = jest.fn();
            const sendMock = jest.fn();
            const responseMock = JSON.stringify([{ id_number: 1, pass_number: "123", exp_date: "2023-12-31" }]);
            
            // Mock XMLHttpRequest
            const mockXHR = {
                open: openMock,
                send: sendMock,
                readyState: 4,
                status: 200,
                responseText: responseMock,
                onreadystatechange: null,
                response: null,
                responseType: "text",
                responseURL: "http://example.com",
                responseXML: null,
                statusText: "OK",
                timeout: 0,
                upload: {}, // Mock upload object, since XMLHttpRequestUpload is not directly available
            };

            jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR);

            // Mock the results_body
            const results_body_mock = document.createElement("div");
            results_body_mock.id = "results";
            document.body.appendChild(results_body_mock);

            // Call the load_data function
            await load_data();

            // Check if XMLHttpRequest methods were called
            expect(openMock).toHaveBeenCalledWith("get", "/get_pass_data");
            expect(sendMock).toHaveBeenCalled();

            // Check if results_body is updated
            const resultRow = results_body_mock.querySelector("tr");
            expect(resultRow).not.toBeNull();  // Ensure resultRow is not null
            if (resultRow) {
                expect(resultRow.innerHTML).toContain("123"); // Modify this based on your actual expected content
            }
        });
    });

    // Similarly, update_pass_data and delete_data tests can be written using jest.spyOn
});
