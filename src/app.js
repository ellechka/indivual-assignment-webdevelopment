import express from "express";
import restaurantRouter from './api/routes/restaurant-router.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/api/v1/restaurants', restaurantRouter);

export default app;