const { checkInfosysStatusPeriodically } = require('./infosysChecker');
const { checkPassportStatusPeriodically } = require('./passportChecker');
const { checkPnrStatusPeriodically } = require('./pnrChecker.js');

checkInfosysStatusPeriodically();
// checkPassportStatusPeriodically();
// checkPnrStatusPeriodically();
