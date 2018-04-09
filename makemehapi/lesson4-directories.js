const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080),
            routes: {
                files: {
                    relativeTo: Path.join(__dirname, 'public')
                }
            }
        });
        await server.register(Inert);

        server.route({
            path: '/foo/bar/baz/{filename}', 
            method:'GET', 
            handler: {
                directory: {
                    path: '.'
                }
            }
        });

        await server.start();
        
        console.log('Server running at:', server.info.uri);
    } 
    catch (error) {
        console.log(error);
    }
})();

