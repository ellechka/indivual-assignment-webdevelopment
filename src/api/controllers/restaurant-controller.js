import { getRestaurants as listRestaurants } from '../models/restaurant-model.js';

const getRestaurants = async (req, res, next) => {
    try {
        const restaurants = await listRestaurants();
        res.json(restaurants);
    } catch (error) {
        next(error);
    }
};

export { getRestaurants };