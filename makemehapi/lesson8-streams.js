const Hapi = require('hapi');
const Inert = require('inert');
const Rot13 = require('rot13-transform');
const Path = require('path');
const Fs = require('fs');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080)
        });
        await server.register(Inert);

        server.route({
            path: '/', 
            method:'GET', 
            handler(request, h){
                return(Fs.createReadStream(Path.join(__dirname, 'files', 'hapiness.txt')).pipe(Rot13()));
            }
        });

        await server.start();
        
        console.log('Server running at:', server.info.uri);
    } 
    catch (error) {
        console.log(error);
    }
})();

