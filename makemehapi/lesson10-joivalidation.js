const Hapi = require('hapi');
const Inert = require('inert');
const Joi = require('joi');

(async () => {
    try
    {
        const server = new Hapi.server({
            host: 'localhost',
            port: Number(process.argv[2] || 8080)
        });

        server.route({
            path: '/login', 
            method:'POST',
            handler: (request, h) => {
                return 'login successful';
            },
            config: {
                validate: {
                    payload: new Joi.object({
                        isGuest: Joi.boolean().required(),
                        username: Joi.string().when('isGuest', { is: false, then: Joi.required() }),
                        password: Joi.string().alphanum(),
                        accessToken: Joi.string().alphanum()        
                    }).options({allowUnknown: true})
                    .without('password', 'accessToken')                    
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

