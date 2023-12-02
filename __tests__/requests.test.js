// updateData.test.js

// Mock XMLHttpRequest
global.XMLHttpRequest = jest.fn(() => ({
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  onreadystatechange: jest.fn()
}));

describe('update_data function', () => {

  it('should send a POST request with the correct data', () => {
    // Set up your DOM
    document.body.innerHTML = `<div id="results"></div>`;

    // Define your element, variable_name, and id
    let element = document.createElement("div");
    element.innerText = "New Value";
    const variable_name = "testVariable";
    const id = "123";

    // Import and call your function here
    const { update_data } = require('../path/to/your/script');
    update_data(element, variable_name, id);

    // Check if XMLHttpRequest was used correctly
    expect(XMLHttpRequest).toHaveBeenCalled();
    const mockXhr = XMLHttpRequest.mock.instances[0];
    expect(mockXhr.open).toHaveBeenCalledWith('POST', '/update_data', true);
    expect(mockXhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/x-www-form-urlencoded');
    expect(mockXhr.send).toHaveBeenCalledWith(`variable_name=${variable_name}&variable_value=${element.innerText}&id_number=${id}`);
  });

  // Add more tests as needed
});
