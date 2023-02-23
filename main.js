const front = require('./frontend/main.js');
const back = require('./backend/main.js');
const settings = require('./settings.json');

front.default(settings.web,settings.backend.port);
back.default(settings.polygon,settings.backend);