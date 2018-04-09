const Hapi = require('hapi');
const Inert = require('inert');
const Joi = require('joi');
const Fs = require('fs');
const Path = require('path');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080)
        });

        server.route({
            path: '/upload', 
            method:'POST',
            handler: (request, h) => {
                return new Promise((resolve, reject) => {
                    var data = request.payload;

                    if(data.file) {

                        var name = data.file.hapi.filename;
                        var path = Path.join(__dirname, "uploads", name);
                        var pathFinal = Path.join(__dirname, "uploads", "final", name);
                        var file = Fs.createWriteStream(path);

                        request.payload.file.on('end', () => {

                            try {
                                Fs.copyFileSync(path, pathFinal);

                                let result = {
                                    description: request.payload.description,
                                    file: {
                                        filename: request.payload.file.hapi.filename,
                                        headers: request.payload.file.hapi.headers
                                    }
                                };

                                return resolve(JSON.stringify(result));
                            }
                            catch(err) {
                                return reject(err);
                            }
                            
                        });

                        data.file.pipe(file);

                        request.payload.file.on('error', (err) => {
                            return reject(err);
                        });
                    }
                    else {
                        return reject('No file stream passed in upload.')
                    }
                    
                });
            },
            config: {
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data'
                }
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

