// api/models/User.js
'use strict';

var _ = require('lodash');


module.exports = _.merge(_.cloneDeep(require('../base/Controller')), {
});
// module.exports = {
//  create: function (req, res) {
//    sails.services.passport.protocols.local.register(req.body, function (err, user) {
//      if (err) return res.serverError(err);
//
//      res.json(200, {user: user, token: token.issue({id: user.id})});
//    });
//  }
// };
