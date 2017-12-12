'use strict';
const Hapi = require('hapi');
const server = new Hapi.Server();
const HapiAuth = require('hapi-auth-jwt2');
const JWT = require('jsonwebtoken');


// mock update user
let user = {
  id: 1,
  name: 'ittipol'
};

server.connection({
  host: 'localhost',
  port: 5000
});

server.register(HapiAuth, err => {
  if (err) { // set in case error validate
    return reply(err);
  }

  server.auth.strategy('jwt', 'jwt', {
    key: 'mysecretKey',
    validateFunc: validate
  });
  server.auth.default('jwt');

});

server.route({
  method: 'GET',
  path: '/',
  config: {
    auth: false
  },
  handler: (request, reply) => {

    let token = JWT.sign(user, 'mysecretKey', {
      expiresIn: '7d'
    });

    // Gen token
    reply({
      token: token
    });
  }
});

server.route({
  method: 'GET',
  path: '/me',
  handler: (request, reply) => {
    reply(request.auth.credentials);
  }
});

server.start(() => {
  console.log("Server is running");
});


// function validate in case username / password checking data sources
function validate(decoded, request, callback) {
  if (decoded.name === 'ittipol') {
    return callback(null, true);
  } else {
    return callback(null, false);
  }
}