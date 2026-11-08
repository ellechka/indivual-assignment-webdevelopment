const restaurantList = document.querySelector('#restaurant-list');

async function loadRestaurants() {
    try {
        const response = await fetch('/api/v1/restaurants');

        if(!response.ok) {
            throw new Error(`Request failed ${response.status}`);
        }

        const restaurants = await response.json();
        const list = document.createElement('ul');

        restaurants.forEach((restaurant) => {
           const item = document.createElement('li');
           item.textContent = restaurant.name;
           list.append(item);
        });

        restaurantList.replaceChildren(list);
    } catch (error) {
        console.error('Could not load restaurants: ', error);
        restaurantList.textContent = 'Could not load restaurants.';
    }
}

loadRestaurants();