const axios = require('axios');
const { sendTelegramMessage } = require('./telegram');

const PNR = process.env.PNR_NUMBER;
const PNR_URL = `https://cttrainsapi.confirmtkt.com/api/v2/ctpro/mweb/${PNR}?querysource=ct-web&locale=en&getHighChanceText=true&livePnr=true`;

let lastPnrStatus = null;

async function checkPnrStatusOnce() {
    const config = {
        method: 'post',
        url: PNR_URL,
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'ApiKey': 'ct-web!2$',
            'CT-Token': '',
            'CT-Userkey': '',
            'ClientId': 'ct-web',
            'Connection': 'keep-alive',
            'Content-Type': 'application/json',
            'DNT': '1',
            'DeviceId': '6b69d005-0c07-464a-8503-b6f38793a11e',
            'Origin': 'https://www.confirmtkt.com',
            'Referer': 'https://www.confirmtkt.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
        },
        data: JSON.stringify({
            proPlanName: "CP1",
            emailId: "",
            tempToken: ""
        })
    };

    try {
        const response = await axios(config);
        const status = response?.data?.data.pnrResponse.passengerStatus[0].currentStatus;

        if (!status) {
            console.log("⚠️ No PNR status found.");
            return;
        }

        if (lastPnrStatus && lastPnrStatus !== status) {
            await sendTelegramMessage(`🚆 PNR Status Updated:\n\n${status}`);
        }

        lastPnrStatus = status;
        console.log("✅ PNR status checked:", status);

    } catch (err) {
        console.error("❌ PNR error:", err.message);
    }
}

async function checkPnrStatusPeriodically() {
    checkPnrStatusOnce();
    setInterval(checkPnrStatusOnce, 5 * 60 * 1000);
}

module.exports = { checkPnrStatusPeriodically };
