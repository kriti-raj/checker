const axios = require('axios');
const https = require('https');
const { constants } = require('crypto');
const { sendTelegramMessage } = require('./telegram');

const agent = new https.Agent({
    secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

let lastPassportStatus = null;

async function checkPassportStatusOnce() {
    const config = {
        method: 'post',
        url: 'https://api1.passportindia.gov.in/v1/online/trackStatusForFileNo',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.passportindia.gov.in',
            'Referer': 'https://www.passportindia.gov.in/',
        },
        httpsAgent: agent,
        data: JSON.stringify({
            requestResponseMap: {
                fileNo: 'PA1065159808625',
                applDob: '13/10/2003',
                optStatus: 'Application_Status',
            }
        })
    };

    try {
        const response = await axios(config);
        const status = response?.data?.requestResponseMap?.applicationStatus?.[0]?.STATUS_MESSAGE;

        if (!status) {
            console.log("⚠️ No Passport status found.");
            return;
        }

        if (lastPassportStatus && lastPassportStatus == status) {
            await sendTelegramMessage(`🛂 Passport Status Updated:\n\n${status}`);
        }

        lastPassportStatus = status;
    } catch (err) {
        console.error("❌ Passport error:", err.message);
    }
}

function checkPassportStatusPeriodically() {
    checkPassportStatusOnce();
    setInterval(checkPassportStatusOnce, 1000);
}

module.exports = { checkPassportStatusPeriodically };
