// requests.test.js
const { describe, it, expect, jest } = require("@jest/globals");
const { JSDOM } = require("jsdom");
require('text-encoding');

// Import the code containing the load_data function
const { load_data } = require('../path/to/your/code/file'); // Update the path accordingly

// Set up jsdom
const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;

describe("load_data function", () => {
    it("should update results_body with data from the server", async () => {
        // Mock XMLHttpRequest
        const mockXHR = {
            open: jest.fn(),
            send: jest.fn(),
            readyState: 4,
            status: 200,
            responseText: JSON.stringify([
                { id_number: 1, imm_status: "Pending", full_name: "John Doe", type: "Student", status: "Active" },
                { id_number: 2, imm_status: "Approved", full_name: "Jane Doe", type: "Faculty", status: "Inactive" }
            ]),
            onreadystatechange: null,
            response: null,
            responseType: "text",
            responseURL: "http://example.com",
            responseXML: null,
            statusText: "OK",
            timeout: 0,
            upload: {},
        };

        // Spy on window.XMLHttpRequest and mock its implementation
        jest.spyOn(window, 'XMLHttpRequest').mockImplementation(() => mockXHR);

        // Set up results_body
        const results_body_mock = document.createElement("div");
        results_body_mock.id = "results";
        document.body.appendChild(results_body_mock);

        // Call the load_data function
        await load_data();

        // Check if XMLHttpRequest methods were called
        expect(mockXHR.open).toHaveBeenCalledWith("get", "/get_data");
        expect(mockXHR.send).toHaveBeenCalled();

        // Check if results_body is updated
        const resultRows = results_body_mock.querySelectorAll("tr");
        expect(resultRows.length).toBe(2);

        // Test the content of the first row (modify based on your actual expected content)
        const firstRowContent = resultRows[0].innerHTML;
        expect(firstRowContent).toContain("<td>1</td>");
        expect(firstRowContent).toContain("<td contenteditable onblur=\"update_data(this, 'imm_status', '1')\">Pending</td>");
        // Add similar expectations for other properties in your rows

        // Test the content of the second row (modify based on your actual expected content)
        const secondRowContent = resultRows[1].innerHTML;
        expect(secondRowContent).toContain("<td>2</td>");
        expect(secondRowContent).toContain("<td contenteditable onblur=\"update_data(this, 'imm_status', '2')\">Approved</td>");
        // Add similar expectations for other properties in your rows
    });
});
