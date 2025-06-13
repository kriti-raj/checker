const axios = require('axios');
const { sendTelegramMessage } = require('./telegram');

const INFOSYS_URL = "https://intapgateway.infosysapps.com/careersci/search/intapjbsrch/getOfferValidation?candidateId=1008460585&dob=2003-10-13";

let lastInfosysStatus = null;

async function checkInfosysStatusOnce() {
    try {
        const res = await axios.get(INFOSYS_URL);
        const currentStatus = res?.data?.message;

        if (!currentStatus) {
            console.log("⚠️ No Infosys status found.");
            return;
        }

        if (lastInfosysStatus && lastInfosysStatus !== currentStatus) {
            await sendTelegramMessage(`💼 Infosys Status Updated:\n\n${currentStatus}`);
        }

        lastInfosysStatus = currentStatus;
    } catch (err) {
        console.error("❌ Infosys error:", err.message);
    }
}

function checkInfosysStatusPeriodically() {
    checkInfosysStatusOnce();
    setInterval(checkInfosysStatusOnce, 5 * 60 * 1000); // every 5 min
}

module.exports = { checkInfosysStatusPeriodically };
