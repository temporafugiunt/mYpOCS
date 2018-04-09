const Hapi = require('hapi');
const Inert = require('inert');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080)
        });

        server.route({
            path: '/{name}', 
            method:'GET', 
            handler: (request, h) => {
                return `Hello ${encodeURIComponent(request.params.name)}`;
                // encodeURIComponent escapes all characters except the following: alphabetic, decimal digits, - _ . ! ~ * ' ( )
                // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
                // for more details why you should call encodeURIComponent on any user-entered parameter
            }
        });

        await server.register(Inert);

        await server.start();
        console.log('Server running at:', server.info.uri);
    } 
    catch (error) {
        console.log(error);
    }
})();

