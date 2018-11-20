const uuidv4 = require('uuid/v4');

function randomUser() {
    return {
        username: uuidv4().slice(0, 20),
        password: uuidv4().slice(0,20)
    };
}

module.exports = {
    randomUser, 
};