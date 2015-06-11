// api/policies/sessionAuth.js
var _ = require('lodash');

module.exports = function(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }

  return res.forbidden('You are not permitted to perform this action.');
};
