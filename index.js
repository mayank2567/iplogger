const https = require('https');
var winston = require('winston');
var CronJob = require('cron').CronJob;
const logDir = 'log';
const tsFormat = () => (new Date()).toLocaleTimeString();
const env = process.env.NODE_ENV || 'development';

var logger = new (winston.Logger)({
    transports: [
        new winston.transports.Console(),
        new (winston.transports.File)({
            filename: `${logDir}/results.log`,
            timestamp: tsFormat,
            maxsize: 5 * 1000 * 1024,
            maxFiles: 1000,
            colorize: true,
            level: env === 'development' ? 'debug' : 'info'
        })

    ]
});


let ipLogger = () => {

    https.get('https://bungeetech.com/whatismyip', (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {

            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            debugger
            let a = data.split('SOURCE IP INFO:');
            let b = a[1].split('ADVANCED SOURCE IP INFO WITH PROXY/TOR/SUSPICIOUS CHECK:');
            logger.warn((JSON.parse(b[0])).ip, (JSON.parse(b[0])).region);
            // console.log((JSON.parse(b[0])).ip);

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}


new CronJob('*/5 * * * *', function () {
    ipLogger();
}, null, true, 'America/Los_Angeles');