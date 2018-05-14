const wrapper = require('../index');

const Req = wrapper.Requester({port: 3000, identity: 'Req'});
const Rep = wrapper.Responder({port: 3000, identity: 'Rep'});

Req.request('hello', 'hello', (res) => {
    console.log(res);
});

Rep.when('hello', (msg, reply) => {
    console.log(msg);
    reply(`reply> ${msg}`);
});

Rep.when('world', (msg, reply) => {
    console.log(msg);
    reply('hey just got a world!');
});

Req.request('world', 'hello world', (res) => {
    console.log(res);
});

let i = 0;
setInterval(() => {
    i++;
    Req.request('hello', `hello world${i}`, (res) => {
        console.log(res);
    })
}, 1000);