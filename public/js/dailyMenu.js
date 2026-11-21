const DAILY_MENU_API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily";
const dailyMenuByRestaurant = document.querySelector('#daily-menu');

async function loadDailyMenu(restaurantId, lang) {
    try {
        const response = await fetch(
            `${DAILY_MENU_API_URL}/${encodeURIComponent(restaurantId)}/${encodeURIComponent(lang)}`
        );

        if (!response.ok) {
            throw new Error(`Request to fetch daily menu failed: ${response.status}`);
        }

        const dailyMenu = await response.json();
        dailyMenuByRestaurant.textContent = JSON.stringify(dailyMenu, null, 2);
    } catch (error) {
        console.error('Could not load daily menu: ', error);
        dailyMenuByRestaurant.textContent = 'Could not load daily menu';
    }
}

const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');
const lang = params.get('lang') || 'en';

if (restaurantId) {
    loadDailyMenu(restaurantId, lang);
} else {
    dailyMenuByRestaurant.textContent = 'Restaurant ID is missing';
}