import { isUsernameAvailable } from './checkUsername.js';

const USER_REGISTER_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/users';
const registerForm = document.querySelector('#register-form');
const registerMessage = document.querySelector('#register-message');

async function registerUser(username, email, password) {
    const response = await fetch(USER_REGISTER_API_URL, {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify({ username, password, email }),
    });

    if (!response.ok) {
        //throw new Error(`Register failed: ${response.status}`);
        const errorBody = await response.text();
        throw new Error(`Register failed: ${response.status} ${errorBody}`);
    }

    return await response.json();
}

const usernameInput = document.querySelector('#username');
const usernameMessage = document.querySelector('#username-message');

let usernameCheckTimeout;
let usernameCheckId = 0;

usernameInput.addEventListener('input', () => {
    clearTimeout(usernameCheckTimeout);

   const username = usernameInput.value.trim();
   const checkId = ++usernameCheckId;

   if (!username) {
       usernameMessage.textContent = '';
       return;
   }

   usernameMessage.textContent = 'Checking...';

   usernameCheckTimeout = setTimeout (async () => {
       try {
           const available = await isUsernameAvailable(username);

           if (checkId !== usernameCheckId) return;

           usernameMessage.textContent = available ? 'Username is available' : 'Username is already taken';
       } catch (error) {
           if (checkId !== usernameCheckId) return;

           console.error('Could not check username:', error);
           usernameMessage.textContent = 'Could not check username';
       }
   }, 400);
});

registerForm.addEventListener('submit', async (event) => {
   event.preventDefault();

   const formData = new FormData(registerForm);

    const username = formData.get('username').trim();

    if (!(await isUsernameAvailable(username))) {
        registerMessage.textContent = 'Username is already taken';
        return;
    }

   try {
       await registerUser(
           username,
           formData.get('email'),
           formData.get('password'),
       );

       registerMessage.textContent = 'Register was successfully';
   } catch (error) {
       console.error('Could not register: ', error);

       if (error.message.includes('535 Authentication failed')) {
           registerMessage.textContent =
               'Your account may have been created, but the confirmation email could not be sent. Please try logging in.';
       } else {
           registerMessage.textContent =
               'Registration failed. Please check your details and try again.';
       }
   }
});

