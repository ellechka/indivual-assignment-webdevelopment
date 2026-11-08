import 'dotenv/config';
import app from './app.js'
import process from 'node:process';

const hostname = process.env.APP_HOSTNAME;
const port = process.env.APP_PORT;

app.listen(port, hostname, () => {
    console.log(`Server running`);
});