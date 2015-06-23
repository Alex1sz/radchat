'use strict';
/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

module.exports = function badRequest(data, options) {

  // Get access to `req`, `res`, & `sails`
  var request = this.req;
  var response = this.res;
  var sails = request._sails;

  options = (typeof options === 'string') ? { view: otpions } : options || {};

  // set status code
  response.status(400);

  // Log error to console
  if (data !== undefined) {
    sails.log.verbose('Sending 400 ("Bad Request") response: \n', data);
  } else {
    sails.log.verbose('Sending 400 ("Bad Request") response');
  }

  return response.jsonx(data);
};
  

