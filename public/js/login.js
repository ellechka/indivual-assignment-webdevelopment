const USER_AUTH_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login';
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

// Handles login form submission and displays the result
async function loginUser(username, password) {

    // Sends the username and password to the login API as JSON
    const response = await fetch(USER_AUTH_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    // If API request has been failed, stops this function and throws Error
    if (!response.ok) {
        throw new Error(`Login failed ${response.status}`);
    }

    // Parses and returns the API response as JSON
    return await response.json();
}

// Handles form submission, sends the login request, and displays the result
loginForm.addEventListener('submit', async (event) => {
    // Prevents the form from reloading the page when submitted
    event.preventDefault();

    // Gets the form data from the login fields
    const formData = new FormData(loginForm);

    try {
        // Calls the function loginUser() and sends login username and password
        await loginUser(
            formData.get('username'),
            formData.get('password')
        );

        //if the user is logged in, displays the link
        localStorage.getItem('loggedIn', 'true');
        document.querySelector("#profile-link").hidden = false;

        // Shows a success message
        loginMessage.textContent = 'You logged in successfully';

    } catch (error) {
        // Logs the error and shows a failure message
        console.log('Could not log in: ', error);
        loginMessage.textContent = 'Log in failed. Check your username and password';

    }
})
