//import load_data from './load_data';
import * as load_data_mock from './load_data';

import update_pass_data from './update_pass_data';
import delete_data from './delete_data';

jest.mock('./load_data');
jest.mock('./update_pass_data');
jest.mock('./delete_data');

describe('load_data', () => {
  it('should fetch data from the server and append it to the results element', () => {
    const mockResults = document.createElement('div');
    mockResults.id = 'results';
    document.body.appendChild(mockResults);

    load_data();

    expect(mockResults.innerHTML).toEqual('<table><tr><td>123456</td><td>123456</td><td>2023-12-31</td><td><button type="button" class="btn btn-danger btn-sm">Delete Record</button></td></tr></table>');
  });
});

describe('update_pass_data', () => {
  it('should update the pass_number and exp_date for the specified record', () => {
    const mockElement = document.createElement('td');
    mockElement.innerText = '123456';
    const variable_name = 'pass_number';
    const id = 123456;

    update_pass_data(mockElement, variable_name, id);

    expect(mockElement.innerText).toEqual('654321');
  });
});

describe('delete_data', () => {
  it('should delete the specified record from the server and reload the data', () => {
    const id = 123456;

    delete_data(id);

    expect(mockResults.innerHTML).toEqual('');
  });
});