import { CronJob } from 'cron';
import https from 'https';

// If you're using dotenv, also import it here:
import dotenv from 'dotenv';
dotenv.config();

const backendUrl = process.env.WEB_URL;

const job = new CronJob('*/10 * * * *', function () {
    console.log('Restarting Server');

    https.get(backendUrl, (res) => {
        if (res.statusCode === 200) {
            return;
            // console.log('Server restarted');
        } else {
            console.error(
                'Failed to restart server with status code: ' + res.statusCode
            );
        }
    }).on('error', (err) => {
        console.error('Error during restart:', err.message);
    });
});

export default job;