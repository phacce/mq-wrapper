# MQ-Wrapper
This is a Nodejs wrapper for socket-based message queues. Currently, it uses [axon](https://www.npmjs.com/package/axon) for its workings.

## Mechanisms
This wrapper currently supports 3 mechanisms:
- push-pull (Push-Pull)
- req-rep (Request-Reply)
- pub-sub (Publish-Subscribe)

See the [examples](https://github.com/phacce/mq-wrapper/tree/master/examples) directory for information on how to use the supported mechanisms.