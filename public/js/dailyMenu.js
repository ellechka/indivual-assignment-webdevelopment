const DAILY_MENU_API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/daily";
const dailyMenuByRestaurant = document.querySelector('#daily-menu');

function displayDailyMenu(menu) {
    const container = document.querySelector('#daily-menu');
    const table = document.createElement('table');
    table.className = 'menu-table';

    const header = document.createElement('thead');
    header.innerHTML = `
        <tr>
            <th scope="col">Dish</th>
            <th scope="col">Price</th>
            <th scope="col">Diets</th>
        </tr>
    `;

    const body = document.createElement('tbody');

    menu.courses.forEach((course) => {
        const row = document.createElement('tr');

        const name = document.createElement('td');
        name.textContent = course.name;

        const price = document.createElement('td');
        price.textContent = course.price;

        const diets = document.createElement('td');
        diets.textContent = course.diets;

        row.append(name, price, diets);
        body.append(row);
    });

    table.append(header, body);
    container.replaceChildren(table);
}

// Fetches and displays the daily menu for the selected restaurant
async function loadDailyMenu(restaurantId, lang) {
    try {

        // Requests restaurant's daily menu from the API using given restaurant ID and language
        const response = await fetch(
            `${DAILY_MENU_API_URL}/${encodeURIComponent(restaurantId)}/${encodeURIComponent(lang)}` // Encodes the value so it can be safely used in a URL
        );

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            throw new Error(`Request to fetch daily menu failed: ${response.status}`);
        }

        // Parses the API response as JSON
        const dailyMenu = await response.json();

        // Displays the daily menu as formatted JSON
        displayDailyMenu(dailyMenu);

    } catch (error) {

        // Log the error and show a message if the menu could not be loaded.
        console.error('Could not load daily menu: ', error);
        dailyMenuByRestaurant.textContent = 'Could not load daily menu';

    }
}

// Reads query parameters from the current page URL
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get('restaurantId');
const lang = params.get('lang') || 'en';

// If current page was received the restaurant ID, calls the function loadDailyMenu, else shows an error
if (restaurantId) {
    loadDailyMenu(restaurantId, lang);
} else {
    dailyMenuByRestaurant.textContent = 'Restaurant ID is missing';
}