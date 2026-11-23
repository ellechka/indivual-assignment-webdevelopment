import { isUsernameAvailable } from "./checkUsername.js";

const API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1";
const form = document.querySelector("#profile-form");
const usernameInput = document.querySelector("#username");
const usernameMessage = document.querySelector("#username-message");
const profileMessage = document.querySelector("#profile-message");
const avatarForm = document.querySelector('#avatar-form');
const avatarMessage = document.querySelector('#avatar-message');
const avatarPreview = document.querySelector('#avatar-preview');

// Uploads the user's avatar and displays it in the profile
avatarForm.addEventListener('submit', async (event) => {
    // Prevents the form from reloading the page when submitted
    event.preventDefault();

    // Gets the user's token and selected avatar file
    const token = localStorage.getItem('token');
    const avatar = document.querySelector('#avatar').files[0];

    // Stops the upload iif the user is not logged in or has not selected file
    if (!token || !avatar) {
        avatarMessage.textContent = 'Please log in and select an image';
        return;
    }

    // Adds the selected avatar file to the form data
    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
        // Sends the avatar to the profile by user's token
        const response = await fetch(`${API_URL}/users/avatar`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            throw new Error(`Avatar upload failed: ${response.status}`);
        }

        // Shows the uploaded avatar and confirms success
        avatarPreview.src = URL.createObjectURL(avatar); // Creates a temporarily URL for displaying the selected image
        avatarPreview.hidden = false;
        avatarMessage.textContent = 'Photo uploaded successfully';
    } catch (error) {
        // Logs the error and shows a failure message
        console.error('Could not upload avatar:', error);
        avatarMessage.textContent = 'Could not upload photo';
    }
});

// Loads the saved username into the profile form
const currentUsername = localStorage.getItem('username');
usernameInput.value = currentUsername || '';

// Validates and saves the user's profile changes
form.addEventListener('submit', async (event) => {
    // Prevents the form from reloading the page when submitted
    event.preventDefault();

    // Gets the form data from the profile changes fields and username
   const formData = new FormData(form);
   const username = formData.get('username').trim();

   try {
       // Checks availability only if the username has changed
       if (username !== currentUsername && !(await isUsernameAvailable(username))) {
           usernameMessage.textContent = 'Username is already taken';
           return;
       }

       usernameMessage.textContent = '';

       // Verifies the user's identity with their current username and password.
       const loginResponse = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: currentUsername,
              password: formData.get('currentPassword'),
          })
       });

       if (!loginResponse.ok) {
           profileMessage.textContent = 'Current password is incorrect';
           return;
       }

       // Collects the uploaded username and email
       const updates = {
         username,
         email: formData.get('email'),
       };

       // Adds the new password to the updates if one was entered
       const newPassword = formData.get('newPassword');
       if (newPassword) {
           updates.password = newPassword;
       }

       // Sends the profile updates to the API
       const response = await fetch(`${API_URL}/users`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(updates),
       });

       if (!response.ok) {
           throw new Error(`Update failed: ${response.status}`);
       }

       // Saves the updated username and confirms the profile update.
       localStorage.setItem('username', username);
       profileMessage.textContent = 'Profile updated successfully';

   } catch (error) {
       // Logs the error and shows a failure message
       console.log('Could not update profile', error);
       profileMessage.textContent = 'Could not update profile';
   }
});