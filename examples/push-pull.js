const wrapper = require('../index');

const Push = wrapper.Pusher({port: 2000, identity: 'Push'});
const Pull = wrapper.Puller({port: 2000, identity: 'Pull'});

setInterval(() => Push.push('puuuusshh...'), 3000);

Pull.when((msg) => {
    console.log(msg);
});