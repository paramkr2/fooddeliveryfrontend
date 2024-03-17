import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom'
import Navbar from './Navbar';
import '@testing-library/jest-dom'
import {AuthProvider} from '../AuthContext'

jest.mock('axios');
describe('<Login /> Integration Test', () => {
  it('should submit the form and login successfully', async () => {
  
	
    // Mock the actual server response data
    const serverResponse = {
      data: { token: 'fakeToken' },
    };
    // Mock axios.post function to return the server response
    (axios.post as jest.Mock).mockResolvedValueOnce(serverResponse);
	
    render(
	 <MemoryRouter>
		  <AuthProvider>
				<Navbar />
				<Login />
		  </AuthProvider>
	  </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

    // Wait for the asynchronous operation (real network request) to complete
    await waitFor(() => {
	
      //expect(authActionMock).toHaveBeenCalledWith('LOGIN');
      //expect(screen.getByTestId('login-success')).toBeInTheDocument(); // Assuming you have a success indicator in your UI
		//expect(AuthProvider).toHaveBeenCalledWith('LOGIN');
		expect(screen.getByTestId('logout-link')).toBeInTheDocument();
	});
  });

});
