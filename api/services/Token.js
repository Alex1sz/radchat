'use strict';

/**
 * jwToken
 *
 * @description :: JSON Webtoken Service for sails
 */

var jwt = require('jsonwebtoken');

// generates a token from supplied payload

module.exports.issue = function issue(payload) {
  sails.log.verbose(__filename + ':' + __line + ' [Service.Token.issue() called]');

  return jwt.sign(
    payload,
    process.env.TOKEN_SECRET || "oursecret"
//    {
//      expiresInMinutes : 180
//    }
  );
};

// verifies token on a request

module.exports.verify = function verify(token, callback) {
  sails.log.verbose(__filename + ':' + __line + ' [Service.Token.verify() called]');

  return jwt.verify(
    token,
    process.env.TOKEN_SECRET || "our secret",
    {}, // options none in this case
    next // callback to call when verification is done
  );
};

/**
 * Service method to get current user token. Note that this will also verify actual token value.
 *
 * @param   {Request}   request     Request object
 * @param   {Function}  next        Callback function
 * @param   {Boolean}   throwError  Throw error from invalid token specification
 *
 * @return  {*}
 */
module.exports.getToken = function getToken(request, next, throwError) {
  sails.log.verbose(__filename + ':' + __line + ' [Service.Token.getToken() called]');

  var token = '';

  // Yeah we got required 'authorization' header
  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');

    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else if (throwError) {
      throw new Error('Invalid authorization header format. Format is Authorization: Bearer [token]');
    }
  } else if (request.param('token')) { // JWT token sent by parameter
    token = request.param('token');
  } else if (throwError) { // Otherwise request didn't contain required JWT token
    throw new Error('No authorization header was found');
  }

  return sails.services.token.verify(token, next);
};
