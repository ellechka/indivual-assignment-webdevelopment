// Gets the header elements
const profileLink = document.querySelector('#profile-link');
const header = document.querySelector('header');
const loginLink = header.querySelector('a[href="login.html"]');
const registerLink = header.querySelector('a[href="register.html"]');
const logoutButton = document.createElement('button');

// Creates the logout button and hides it until the user logs in
logoutButton.type = 'button';
logoutButton.textContent = 'Logout';
logoutButton.hidden = true;
header.append(logoutButton);

// Shows profile and logout links only when the user is logged in
function updateHeader() {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    profileLink.hidden = !isLoggedIn;
    logoutButton.hidden = !isLoggedIn;
    loginLink.hidden = isLoggedIn;
    registerLink.hidden = isLoggedIn;
}

// Logs out the user and redirects to the home page
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');
    updateHeader();
    window.location.href = 'index.html';
});

// Updates the header after login and when the page loads
window.addEventListener('auth-state-changed', updateHeader);
updateHeader();