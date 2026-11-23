import { getFavoriteIds, toggleFavorite, sortFavorites } from './favorites.js';

const RESTAURANTS_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const restaurantList = document.querySelector('#restaurant-list');

// Displays restaurants with favorites at the top
function displayRestaurants(restaurants) {
    const favoriteIds = getFavoriteIds();
    const list = document.createElement('ul');

    // Displays each restaurant with a button to toggle its favorite status
    sortFavorites(restaurants).forEach((restaurant) => {
        const item = document.createElement('li');
        item.textContent = restaurant.name + ' ';
        
        // Checks whether this restaurant is in the favorites list
        const isFavorite = favoriteIds.includes(restaurant._id);

        // Creates a button for marking the restaurant as a favorite
        const favoriteButton = document.createElement('button');
        favoriteButton.type = 'button';
        favoriteButton.className = 'favorite-button';
        favoriteButton.textContent = '♡';
        favoriteButton.classList.toggle('favorite-button-active', isFavorite);
        favoriteButton.setAttribute('aria-label', isFavorite
            ? 'Remove from favorites'
            : 'Add to favorites');
        favoriteButton.setAttribute('aria-pressed', isFavorite);
        favoriteButton.addEventListener('click', () => {
            toggleFavorite(restaurant._id);
            displayRestaurants(restaurants);
        });
        
        // Creates a link to the restaurant's daily menu.
        const dailyMenuLink = document.createElement('a');
        dailyMenuLink.textContent = 'View daily menu';

        // Creates a link to the restaurant's weekly menu.
        const weeklyMenuLink = document.createElement('a');
        weeklyMenuLink.textContent = 'View weekly menu';
        
        // Sets the restaurant ID and language for the menu links
        const params = new URLSearchParams({
            restaurantId: restaurant._id,
            lang: 'en',
        });

        // Sets the restaurant-specific URLs for both menu links
        dailyMenuLink.href = `daily-menu.html?${params}`;
        weeklyMenuLink.href = `weekly-menu.html?${params}`;

        item.append(favoriteButton, dailyMenuLink, weeklyMenuLink);
        list.append(item);
    });

    restaurantList.replaceChildren(list);
}

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

        displayRestaurants(restaurants);
    } catch (error) {
        // Log the error and show a message if the menu could not be loaded.
        console.error('Could not load restaurants: ', error);
        restaurantList.textContent = 'Could not load restaurants.';
    }
}

loadRestaurants();