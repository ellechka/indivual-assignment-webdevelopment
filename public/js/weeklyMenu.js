const WEEKLY_MENU_API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly";
const weeklyMenuByRestaurant = document.querySelector('#weekly-menu');

// Fetches and displays the weekly menu for the selected restaurant
async function loadWeeklyMenu(restaurantId, lang) {
    try {

        // Requests restaurant's weekly menu from the API using given restaurant ID and language
        const response = await fetch(
            `${WEEKLY_MENU_API_URL}/${encodeURIComponent(restaurantId)}/${encodeURIComponent(lang)}` // Encodes the value so it can be safely used in a URL
        );

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            throw new Error(`Request to fetch weekly menu failed: ${response.status}`);
        }

        // Parses the API response as JSON
        const weeklyMenu = await response.json();

        // Displays the weekly menu as formatted JSON
        weeklyMenuByRestaurant.textContent = JSON.stringify(weeklyMenu, null, 2);

    } catch (error) {

        // Log the error and show a message if the menu could not be loaded.
        console.error('Could not load daily menu: ', error);
        weeklyMenuByRestaurant.textContent = 'Could not load weekly menu';

    }
}

// Reads query parameters from the current page URL
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');
const lang = params.get('lang') || 'en';

// If current page was received the restaurant ID, calls the function loadDailyMenu, else shows an error
if (restaurantId) {
    loadWeeklyMenu(restaurantId, lang);
} else {
    weeklyMenuByRestaurant.textContent = 'Restaurant ID is missing';
}