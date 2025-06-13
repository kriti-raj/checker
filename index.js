const { checkInfosysStatusPeriodically } = require('./infosysChecker');
const { checkPassportStatusPeriodically } = require('./passportChecker');

checkInfosysStatusPeriodically();
checkPassportStatusPeriodically();
