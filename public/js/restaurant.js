const RESTAURANTS_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const restaurantList = document.querySelector('#restaurant-list');

// Fetches and displays all restaurants
async function loadRestaurants() {
    try {
        // Requests all restaurants from the API
        const response = await fetch(RESTAURANTS_API_URL);

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            throw new Error(`Request failed ${response.status}`);
        }

        // Parses the API response as JSON
        const restaurants = await response.json();

        // Create a list of restaurants with links to their menus.
        const list = document.createElement('ul');

        restaurants.forEach((restaurant) => {
           const item = document.createElement('li');
           item.textContent = restaurant.name + ' ';
           
           const dailyMenuLink = document.createElement('a');
           dailyMenuLink.textContent = 'View daily menu';

           const weeklyMenuLink = document.createElement('a');
           weeklyMenuLink.textContent = 'View weekly menu';
           
           const params = new URLSearchParams({
              restaurantId: restaurant._id,
              lang: 'en', 
           });

           dailyMenuLink.href = `daily-menu.html?${params}`;
           weeklyMenuLink.href = `weekly-menu.html?${params}`;
           
           item.append(dailyMenuLink);
           item.append(weeklyMenuLink);
           list.append(item);
        });

        restaurantList.replaceChildren(list);
    } catch (error) {
        // Log the error and show a message if the menu could not be loaded.
        console.error('Could not load restaurants: ', error);
        restaurantList.textContent = 'Could not load restaurants.';
    }
}

loadRestaurants();