'use strict';
/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendOK (data, options) {

  // Get access to `req`, `res`, & `sails`
  var request = this.req;
  var response = this.res;
  var sails = request._sails;

  options = (typeof options === 'string') ? {view: options} : options || {};

  sails.log.silly('res.ok() :: Sending 200 ("OK") response');

  // Set status code
  response.status(200);

  return response.jsonx(data)
};
