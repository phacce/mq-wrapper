const axon = require('axon');

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Logs data if not in production mode
 * @param {any} msg - anything to be logged
 */
function log(msg) {
    if (isDev) console.log(msg);
}

module.exports = (mq) = {

    /**
     * This returns a Pusher object
     */
    Pusher : ({port, identity, host="127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let pusher = Object.create(axon.socket('push'));
        pusher.bind(`tcp://${host}:${port}`);
        pusher.push = (data) => pusher.send(data);
        mq.addListeners(pusher);
        return pusher;
    },

    /**
     * This returns a Puller object
     */
    Puller : ({port, identity, host="127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let puller = Object.create(axon.socket('pull'));
        puller.connect(`tcp://${host}:${port}`);
        puller.when = (callback) => puller.on('message', callback);
        mq.addListeners(puller);
        return puller;
    },

    /**
     * This returns a Requester object.
     * @param{Object}
     */
    Requester : ({port, identity, host="127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let requester = Object.create(axon.socket('req'));
        requester.bind(`tcp://${host}:${port}`);
        requester.request = (type, msg, callback) => requester.send(type, msg, callback);
        mq.addListeners(requester);
        return requester;
    },

    /**
     * This returns a Responder object.
     * @param {Object}
     */
    Responder : ({port, identity, host="127.0.0.1"})=> {
        mq.checkParams(port, identity)
        let responder = Object.create(axon.socket('rep'));
        responder.connect(`tcp://${host}:${port}`);
        /** @param type - the type or category of the request **/
        responder.when = (type, callback) => {
            responder.on('message', (msgType, msg, reply) => {
                if (type === msgType) callback(msg, reply);
            });
        };
        mq.addListeners(responder);
        return responder;
    },

    /**
     * This returns a Publisher object.
     * @param {Object}
     */
    Publisher : ({port, identity, host = "127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let publisher = Object.create(axon.socket('pub'));
        publisher.connect(`tcp://${host}:${port}`);
        publisher.publish = (topic, data) => publisher.send(topic, data);
        mq.addListeners(publisher);
        return publisher;
    },

    /**
     * This returns a Subscriber object.
     * @param {Object}
     */
    Subscriber : ({port, identity, host = "127.0.0.1"}) => {
        mq.checkParams(port, identity);
        let subscriber = Object.create(axon.socket('sub'));
        subscriber.bind(`tcp://${host}:${port}`);
        subscriber.when = (topic, callback) => {
            subscriber.subscribe(topic);
            subscriber.on('message', (msgTopic, data) => {
                if (msgTopic === topic) callback(data);
            });
        };
        mq.addListeners(subscriber);
        return subscriber;
    },

    /**
     * This performs a validation check on the port and socket 'identity' parameters passed
     * and throws an error if they do not pass the check.
     * @param {String} port - the port number
     * @param {String} identity - the identity for the socket
     */
    checkParams : (port, identity)=> {
        if(isNaN(port) || !identity){
            throw new Error("Invalid Argument supplied, make sure port is a number and identity is a valid string");
        }
    },

    /**
     * This adds listeners to the socket objects.
     * @param socket - the MQ socket object
     */
    addListeners : (socket) => {
        socket.on('connect', (s) => {log(`connected to ${s}`) });
        socket.on('reconnect attempt', (s) => {log(`attempting to reconnect with ${s}`);});
        socket.on('drop', (msg) => {log(`Message dropped due to HWM: ${msg}`);});
        socket.on('bind', ()  => {log('Server successfully bound');});
        socket.on('flush', (msg) => {log('Queued messages have been flushed');});
        socket.on('close', (s)=> {log(`connection closed at ${s}`);});
        socket.on('ignored_error', (err) => {log(`Unhandled error ignored at ${err}`)});
        socket.on('socket_error', (err) => {log(`A debug socket error ignored at ${err}`)});
        socket.on('error', (err)=> {log(`Socket error occurred at ${err}`);});
        socket.on('disconnect', (s)=> {log(`disconnected from ${s}`);});

        log('Now monitoring...');
    }
};