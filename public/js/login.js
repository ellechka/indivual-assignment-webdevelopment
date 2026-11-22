const USER_AUTH_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/auth/login';
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');

async function loginUser(username, password) {
    const response = await fetch(USER_AUTH_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        throw new Error(`Login failed ${response.status}`);
    }

    return await response.json();
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    try {
        await loginUser(
            formData.get('username'),
            formData.get('password')
        );

        loginMessage.textContent = 'You logged in successfully';
    } catch (error) {
        console.log('Could not log in: ', error);
        loginMessage.textContent = 'Log in failed. Check your username and password';
    }
})
