'use strict';

// api/models/User.js

var _ = require('lodash');

module.exports = _.merge(_.cloneDeep(require('../base/Model')), {
  attributes: {
    username: {
      type: 'string',
      unique: true
    },
    email: {
      type: 'email',
      unique: true
    },
    
    admin: {
      type: 'boolean',
      defaultsTo: false
    },
    // specifications for relations to other models
    passports: {
      collection: 'Passport',
      via: 'user'
    },
    // message objects that user has sent
    messages: {
      collection: 'Message',
      via: 'user'
    },
    // login objects that are aattached to user
    logins: {
      collection: 'UserLogin',
      via: 'user'
    },
    requestLogs: {
      collection: 'RequestLog',
      via: 'user'
    },

    // below are relations to other objects via generic 'createdUser' and 'updatedUser' properties
    // Books
    createdBooks: {
      collection: 'Book',
      via: 'createdUser'
    },
    updatedBooks: {
      collection: 'Book',
      via: 'updatedUser'
    }
  }
});
