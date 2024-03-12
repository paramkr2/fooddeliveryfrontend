import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom'
jest.mock('axios');
describe('<Login /> Integration Test', () => {
  it('should submit the form and login successfully', async () => {
    const authActionMock = jest.fn();
	
    // Mock the actual server response data
    const serverResponse = {
      data: { token: 'fakeToken' },
    };

    // Mock axios.post function to return the server response
      (axios.post as jest.Mock).mockResolvedValueOnce(serverResponse);

    render(
	 <MemoryRouter>
      <AuthContext.Provider value={{ isLoggedIn: false, authAction: authActionMock }}>
        <Login />
      </AuthContext.Provider>
	  </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Wait for the asynchronous operation (real network request) to complete
    await waitFor(() => {
      // Assertions based on the actual server response
      //expect(authActionMock).toHaveBeenCalledWith('LOGIN');
      //expect(screen.getByTestId('login-success')).toBeInTheDocument(); // Assuming you have a success indicator in your UI
		expect(authActionMock).toHaveBeenCalledWith('LOGIN');
		expect(window.location.pathname).toBe('/');
	});
  });

});
