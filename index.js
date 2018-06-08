const https = require('https');
var winston = require('winston');
var CronJob = require('cron').CronJob;
var logger = new(winston.Logger)({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: './all-logs.log'
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
            logger.warn((JSON.parse(b[0])).ip,(JSON.parse(b[0])).region); 
            // console.log((JSON.parse(b[0])).ip);

        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });
}


new CronJob('*/5 * * * *', function () {
    ipLogger();
}, null, true, 'America/Los_Angeles');