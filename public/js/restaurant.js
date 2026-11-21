const RESTAURANTS_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';
const restaurantList = document.querySelector('#restaurant-list');

async function loadRestaurants() {
    try {
        const response = await fetch(RESTAURANTS_API_URL);

        if(!response.ok) {
            throw new Error(`Request failed ${response.status}`);
        }

        const restaurants = await response.json();
        console.log(restaurants);
        
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
        console.error('Could not load restaurants: ', error);
        restaurantList.textContent = 'Could not load restaurants.';
    }
}

loadRestaurants();