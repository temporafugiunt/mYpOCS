const Hapi = require('hapi');
const Path = require('path');
const Inert = require('inert');

var server = new Hapi.server({
    port: 3333,
    host: 'localhost'
});

server.route({
    path: '/hello',
    method: 'GET',
    handler: (request, h) => {
        return 'Hello, world!';
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: (request, h) => {
        return 'Hello, ' + encodeURIComponent(request.params.name) + '!';
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return h.file('/templates/index.html');
    }
});

const init = async () => {
    await server.register({
        plugin: require('hapi-pino', Inert),
        options: {
            prettyPrint: false,
            logEvents: ['response']
        }
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

server.ext({
    type: 'onRequest',
    method: function (request, h) {
        console.log('Request Received: ' + request.path);
        return h.continue;
    }
});

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();