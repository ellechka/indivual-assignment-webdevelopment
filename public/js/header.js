// if the user is not logged in, hides the button with id  
// and keeps its state in local storage
document.querySelector("#profile-link").hidden =
    localStorage.getItem('loggedIn') !== 'true';