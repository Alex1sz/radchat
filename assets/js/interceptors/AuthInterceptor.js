/**
 * Auth interceptor for HTTP and Socket request. This interceptor will add required
 * JWT (Json Web Token) token to each requests. That token is validated in server side
 * application.
 *
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-introduction/
 * @see http://angular-tips.com/blog/2014/05/json-web-tokens-examples/
 */
 (function() {
  'use strict';

  angular.module('assets.js.interceptors')
    .factory('AuthInterceptor', [
      '$q', '$injector', '$localStorage',
      function(
        $q, $injector, $localStorage
      ) {
        return {

          /**
           * Interceptor method for $http requests. Purpose is to add JWT token
           * to every request that application does.
           * @param   {*} config  HTTP request configuration
           * @returns {*}
           */
          request: function requestCallback(config) {
            var token;

            if ($localStorage.credentials) {
              token = $localStorage.credentials.token;
            }

            if (token) {
              if (!config.data) {
                config.data = {};
              }
              /**
               * Set token to data and headers
               */
              config.data.token = token;
              config.headers.authorization = 'Bearer ' + token;
            }
            return config;
          },
          
          responseError: function responseErrorCallback(response {
            if (response.status === 401) {
              $localStorage.$reset();
              $injector('$state').go('auth.login');
            }
            return $q.reject(response);
          }
        };
      }
    ])
  ;
}());
