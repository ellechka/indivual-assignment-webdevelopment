const WEEKLY_MENU_API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly";
const weeklyMenuByRestaurant = document.querySelector('#weekly-menu');

async function loadWeeklyMenu(restaurantId, lang) {
    try {
        const response = await fetch(
            `${WEEKLY_MENU_API_URL}/${encodeURIComponent(restaurantId)}/${encodeURIComponent(lang)}`
        );

        if (!response.ok) {
            throw new Error(`Request to fetch weekly menu failed: ${response.status}`);
        }

        const weeklyMenu = await response.json();
        weeklyMenuByRestaurant.textContent = JSON.stringify(weeklyMenu, null, 2);
    } catch (error) {
        console.error('Could not load daily menu: ', error);
        weeklyMenuByRestaurant.textContent = 'Could not load weekly menu';
    }
}

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');
const lang = params.get('lang') || 'en';

if (restaurantId) {
    loadWeeklyMenu(restaurantId, lang);
} else {
    weeklyMenuByRestaurant.textContent = 'Restaurant ID is missing';
}