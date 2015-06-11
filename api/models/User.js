// api/models/User.js
'use strict';
var _ = require('lodash');
var bcrypt = require('bcrypt');
var crypto = require('crypto');


function hashPassword (values,  next) {
  bcrypt.genSalt(values.password, salt, function(error, hash) {
    if (error) {
      return next(error);
    }
    values.encryptedPassword = hash;
    next();
  });
}

module.exports = {
  attributes: {
    username: {
      type: 'string',
      unique: true,
      index: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: 'string',
      minLength: 8,
      required: true
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

    toJSON: function () {
      var user = this.toObject();
      delete user.password;
      user.gravatarUrl = this.getGravatarUrl();
      return user;
    },

    beforeCreate: function (values, next) {
      hashPassword(values, next);
    },

    beforeValidate: function (user, next) {
      if (_.isEmpty(user.username)) {
        user.username = user.email;
      }
      next();
    },

    comparePassword: function (password, user, cb) {
      bcrypt.compare(password, user.encryptedPassword, function (error, match) {
        if(error) 
          cb(error);
        if(match) {
          cb(null, true);
        } else {
          cb(error);
        }
      })
    },
    /**
     * register a new User with a passport
     */
    register: function (user) {
      return new Promise(function (resolve, reject) {
        sails.services.passport.protocols.local.createUser(user, function (error, created) {
          if (error) return reject(error);
          resolve(created);
        });
      });
    }
  }
};