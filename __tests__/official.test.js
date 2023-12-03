jest.mock('fetch');

it('should fetch and populate official details', async () => {
  const mockResponse = {
    json: () => Promise.resolve({
      off_id: 123,
      off_name: 'John Doe',
      off_email: 'johndoe@example.com',
    }),
  };

  fetch.mockReturnValue(Promise.resolve(mockResponse));

  await getOfficialInfo();

  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith('/get-session-user', { method: 'GET' });

  expect(id).toBe(123);
  expect(document.getElementById('ID').innerText).toBe('123');
  expect(document.getElementById('Full_Name').innerText).toBe('John Doe');
  expect(document.getElementById('email').innerText).toBe('johndoe@example.com');
});
