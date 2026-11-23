const WEEKLY_MENU_API_URL = "https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants/weekly";
const weeklyMenuByRestaurant = document.querySelector('#weekly-menu');

// Displays the weekly menu in a user-friendly way
function displayWeeklyMenu(menu) {
    const days = menu.days;
    const container = document.querySelector("#weekly-menu");

    // Shows the message and exists the function
    if (!days.length) {
        container.textContent = 'No weekly menu available';
        return;
    }

    // Creates the main container for the weekly menu
    const layout = document.createElement('div');
    layout.className = 'weekly-layout';

    const dayList = document.createElement('nav');
    dayList.className = 'weekly-days';

    const dayMenu = document.createElement('section');

    // Displays the menu for the selected day
    function showDay(index) {
        const day = days[index];

        // Highlights the selected day button
        dayList.querySelectorAll('button').forEach((button, buttonIndex) => {
            button.classList.toggle('active', buttonIndex === index);
        });

        const title = document.createElement('h2');
        title.textContent = day.date;

        // Creates the weekly menu's headers of the table
        const table = document.createElement('table');
        table.className = 'menu-table';
        table.innerHTML = `
        <thead>
            <tr>
                <th>Dish</th>
                <th>Price</th>
                <th>Diets</th>
            </tr>
        </thead>
        `;

        const body = document.createElement('tbody');

        // Creates a table row for each day and populates it with data,
        // even if the returned array is empty
        (day.courses || []).forEach((course) => {
           const row = document.createElement('tr');
           row.innerHTML = `
                <td>${course.name}</td>
                <td>${course.price}</td>
                <td>${course.diets}</td>
           `;
           body.append(row);
        });

        // Adds rows to the table
        table.append(body);
        dayMenu.replaceChildren(title, table);
    }

    // Creates clickable buttons for each day
    days.forEach((day, index) => {
       const button = document.createElement('button');
       button.type = 'button';
       button.textContent = day.date;
       button.addEventListener('click', () => showDay(index));
       dayList.append(button);
    });

    // Adds the day navigation and menu to the main layout
    layout.append(dayList, dayMenu);
    container.replaceChildren(layout);
    showDay(0);
}

// Fetches and displays the weekly menu for the selected restaurant
async function loadWeeklyMenu(restaurantId, lang) {
    try {

        // Requests restaurant's weekly menu from the API using given restaurant ID and language
        const response = await fetch(
            `${WEEKLY_MENU_API_URL}/${encodeURIComponent(restaurantId)}/${encodeURIComponent(lang)}` // Encodes the value so it can be safely used in a URL
        );

        // If API request has been failed, stops this function and throws Error
        if (!response.ok) {
            //throw new Error(`Request to fetch weekly menu failed: ${response.status}`);
            const errorBody = await response.json();
            console.error(response.status, errorBody);
            throw new Error(`ERROR: ${response.status}`);

        }

        // Parses the API response as JSON
        const weeklyMenu = await response.json();

        // Calls the function which displays weekly menu
        displayWeeklyMenu(weeklyMenu);

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