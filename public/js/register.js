import { isUsernameAvailable } from './checkUsername.js'; // imports isUsernameAvailable() func

const USER_REGISTER_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/users';
const registerForm = document.querySelector('#register-form');
const registerMessage = document.querySelector('#register-message');

// Handles register form submission and displays the result
async function registerUser(username, email, password) {

    // Sends the username, password and email to the login API as JSON
    const response = await fetch(USER_REGISTER_API_URL, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({ username, password, email }),
    });

    // If API request has been failed, stops this function and throws Error
    if (!response.ok) {
        throw new Error(`Register failed: ${response.status}`);
    }

    // Parses and returns the API response as JSON
    return await response.json();
}

const usernameInput = document.querySelector('#username');
const usernameMessage = document.querySelector('#username-message');

// Keeps track of the username check
let usernameCheckTimeout;
let usernameCheckId = 0;

// Checks username availability while the user types
usernameInput.addEventListener('input', () => {

    // Clears the previous timer
    clearTimeout(usernameCheckTimeout);

    // Gets the username and updates the check ID
    const username = usernameInput.value.trim();
    const checkId = ++usernameCheckId;

    // Clears the message if the username is empty
    if (!username) {
        usernameMessage.textContent = '';
        return;
    }

    usernameMessage.textContent = 'Checking...';

    // Checks the username after a short delay
    usernameCheckTimeout = setTimeout (async () => {
        try {
            // Calls the isUsernameAvailable() func asynchronously and keeps it
            const available = await isUsernameAvailable(username);

            // Ignores the result if the username has changed.
            if (checkId !== usernameCheckId) return;

            // Shows whether the username is available
            usernameMessage.textContent = available ? 'Username is available' : 'Username is already taken';
        } catch (error) {

            if (checkId !== usernameCheckId) return;

            // Logs the error and shows a message if the check fails.
            console.error('Could not check username:', error);
            usernameMessage.textContent = 'Could not check username';
        }
    }, 400); // sets timeout time 400ms before checking the username
});

// Handles form submission, sends the register request, and displays the result
registerForm.addEventListener('submit', async (event) => {

    // Prevents the form from reloading the page when submitted
    event.preventDefault();

    // Gets the form data from the login fields
    const formData = new FormData(registerForm);

    // Gets the username separately from other data for further handling
    const username = formData.get('username').trim();

    try {
        // Stops registration if the username is already taken.
        if (!(await isUsernameAvailable(username))) {
            registerMessage.textContent = 'Username is already taken';
            return;
        }

        // Calls the function registerUser() and sends register username, email and password
        await registerUser(
            username,
            formData.get('email'),
            formData.get('password'),
        );

        // Shows a success message
        registerMessage.textContent = 'Register was successfully';
    } catch (error) {
        // Logs the error and shows a failure message
        console.error('Could not register: ', error);

        /* The API may return a 535 Authentication failed error when it cannot send the confirmation email,
         even if the account was created. Check for this error and show the user a specific message.
         */
        if (error.message.includes('535 Authentication failed')) {
            registerMessage.textContent = 'Your account may have been created, but the confirmation email could not be sent. Please try logging in.';
        } else {
            registerMessage.textContent = 'Registration failed. Please check your details and try again.';
        }
    }
});
