const front = require('./frontend/main.js');
const back = require('./backend/main.js');
const settings = require('./settings.json');

front(settings.web);
back(settings.polygon,settings.backend);