import { getFavoriteIds, toggleFavorite, sortFavorites } from './favorites.js';

const RESTAURANTS_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const restaurantList = document.querySelector('#restaurant-list');
let allRestaurants = [];
let userPosition = null;

// Calculates the approximate distance from the user to a restaurant
function getDistance(restaurant) {
    const [longitude, latitude] = restaurant.location.coordinates;

    // Approximate distance for sorting nearby restaurants.
    return Math.hypot(
        latitude - userPosition.latitude,
        (longitude - userPosition.longitude) *
        Math.cos(userPosition.latitude * Math.PI / 180)
    );
}

// Displays restaurants with favorites at the top
function displayRestaurants(restaurants) {
    const favoriteIds = getFavoriteIds();
    const list = document.createElement('ul');
    const sortedRestaurants = sortFavorites(restaurants);
    const sortOption = document.querySelector('#sort').value;

    if (sortOption === 'name') {
        // Sorts favorites first, then sorts restaurants alphabetically
        sortedRestaurants.sort((a, b) => {
            const favoriteOrder =
                Number(favoriteIds.includes(b._id)) -
                Number(favoriteIds.includes(a._id));

            return favoriteOrder || a.name.localeCompare(b.name);
        });
    } else if (userPosition && sortOption === 'distance') {
        // Sorts favorites first, then orders restaurants by distance
        sortedRestaurants.sort((a, b) => {
            const favoriteOrder =
                Number(favoriteIds.includes(b._id)) -
                Number(favoriteIds.includes(a._id));

            return favoriteOrder || getDistance(a) - getDistance(b);
        });
    }

    // Displays each restaurant with a button to toggle its favorite status
    sortedRestaurants.forEach((restaurant) => {
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
    // Updates the restaurant order based on the selected sorting option and user location.
    document.querySelector('#sort').addEventListener('change', (event) => {
        if (event.target.value !== 'distance') {
            userPosition = null;
            displayRestaurants(allRestaurants);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                userPosition = {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                };
                displayRestaurants(allRestaurants);
            },
            () => {
                alert('Could not get your location. Check your browser permissions.');
                displayRestaurants(allRestaurants);
            }
        );
    });
    
    try {
        // Requests all restaurants from the API
        const response = await fetch(RESTAURANTS_API_URL);

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            throw new Error(`Request failed ${response.status}`);
        }

        // Parses the API response as JSON
        const restaurants = await response.json();

        allRestaurants = restaurants;
        displayRestaurants(allRestaurants);
    } catch (error) {
        // Log the error and show a message if the menu could not be loaded.
        console.error('Could not load restaurants: ', error);
        restaurantList.textContent = 'Could not load restaurants.';
    }
}

loadRestaurants();