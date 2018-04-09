const Hapi = require('hapi');
const Inert = require('inert');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080),
            routes: {
                files: {
                    relativeTo: __dirname
                }
            }
        });
        await server.register(Inert);

        server.route({
            path: '/', 
            method:'GET', 
            handler: {
                file: 'index.html'
            }
        });

        await server.start();
        
        console.log('Server running at:', server.info.uri);
    } 
    catch (error) {
        console.log(error);
    }
})();

