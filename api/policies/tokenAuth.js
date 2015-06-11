'use strict';
var _ = require('lodash');

module.exports = function(request, response, next) {
  var token;

  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');
    
    if (parts.length == 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return response.json(401, {error: 'Format is Authorization: Bearer [token]'});
    }
  } else if (request.param('token')) {
    token = request.param('token');
    // delete the token from param to not mess with blueprints
    request.query && delete request.query.token;
    request.body && delete request.body.token;
    return next();
  } else {
    return response.json(401, {error: 'No Authorization header was found'});
  }

  sails.services.jwToken.verifyToken(token, function(error, token) {
    if (error) return response.json(401, {error: 'The token is not valid'});

    request.token = token;

    next();
  });
};
