const Hapi = require('hapi');
const Inert = require('inert');
const Path = require('path');
const Vision = require('vision');
const Handlebars = require('handlebars');

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
        await server.register([Inert, Vision]);
        await server.views({
            engines: {
                html: Handlebars
            },
            path: Path.join(__dirname, 'templates'),
            helpersPath: 'helpers'
        })

        server.route({
            path: '/', 
            method:'GET', 
            handler: {
                view: 'index2.html'
            }
        });

        await server.start();
        
        console.log('Server running at:', server.info.uri);
    } 
    catch (error) {
        console.log(error);
    }
})();

