const wrapper = require('../index');

const Pub = wrapper.Publisher({port: 4000, identity: 'Pub'});
const Sub = wrapper.Subscriber({port: 4000, identity: 'Sub'});

setInterval(() => {
    Pub.publish('login', {name: 'Leo'});
}, 500);

Sub.when('login', (user) => {
    console.log(user, ' signed in');
});

Sub.when('paid', (msg) => {
    console.log(msg, ' just subscribed');
});