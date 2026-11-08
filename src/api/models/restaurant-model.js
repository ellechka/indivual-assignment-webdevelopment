const RESTAURANTS_API_URL = 'https://media2.edu.metropolia.fi/restaurant/api/v1/restaurants';

const getRestaurants = async () => {
    const response = await fetch(RESTAURANTS_API_URL);

    if(!response.ok) {
        throw new Error(`Restaurants API returned status ${response.status}`);
    }

    return response.json();
};

export { getRestaurants };
