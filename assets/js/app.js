(function() {
  'use strict';

  angular.module('app', [
    'ui.bootstrap',
    'ui.router',
    'ngMessages',
    'app-templates'
  ]);
  /**
   * Configuration for frontend application, this contains following main sections:
   *
   *  1) Configure $httpProvider and $sailsSocketProvider
   *  2) Set necessary HTTP and Socket interceptor(s)
   *  3) Turn on HTML5 mode on application routes
   *  4) Set up application routes
   */

  angular.module('app')
    .config([
      '$stateProvider', 
      '$locationProvider', 
      '$urlRouterProvider', 
      '$httpProvider', 
      'AccessLevels',
      function config(
        $stateProvider, 
        $locationProvider, 
        $urlRouterProvider, 
        $httpProvider, 
        AccessLevels
      ) {
        $httpProvider.defaults.headers.common['X-Requested-With'];
        // add intercepters for $httpProvider and todo: $sailsSocketProvider
        $httpProvider.inceptors.push('AuthInterceptor');
        $httpProvider.interceptors.push('ErrorInterceptor');

        // Iterate $httpProvider interceptors and add those to $sailsSocketProvider
        angular.forEach($httpProvider.interceptors, function iterator(interceptor) {
          $sailsSocketProvider.interceptors.push(interceptor);
        });

        // use html5 urls
        $locationProvider
          .html5Mode({
            enabled: true,
            requireBase: false
          })
          .hashPrefix('!')
        ;

        // Routes that need autenticated user
        $stateProvider
          .state('user', {
            abstract: true,
            template: '<ui-view/>',
            data: {
              access: AccessLevels.user
            }
          })
        ;

        // main state provider for app
        $stateProvider
          .state('anon', {
            abstract: true,
            template: '<ui view/>',
            data: {
              access: AccessLevels.anon
            }
          })
          .state('anon.index', {
            abstract: true,
            url: '/',
            templateUrl: 'index.html'
          })
          .state('anon.login', {
            templateUrl: 'auth/login.html',
            controller: 'LoginController'
          })
          .state('anon.register', {
            templateUrl: 'auth/register.html',
            controller: 'RegisterController'
          });

        // For any unmatched url, redirect to root
        $urlRouterProvider.otherwise('/');
      }
    ])
  ;
  /**
   * Frontend application run hook configuration. This will attach auth status
   * check whenever application changes URL states.
   */
  angular.module('app')
    .run([
      '$rootScope', '$state', '$injector', 'AuthService',
      function run(
        $rootScope, $state, $injector, AuthService
      ) {

        /**
         * Route state change start event, this is needed for following:
         *  1) Check if user is authenticated to access page, and if not redirect user back to login page
         */
        $rootScope.$on('$stateChangeStart', function stateChangeStart(event, toState) {
          if (!AuthService.authorize(toState.data.access)) {
            event.preventDefault();

            $state.go('auth.login');
          }
        });
        
        // Check for state change errors
        $rootScope.$on('$stateChangeError', function stateChangeError(event, toState, toParams, fromState, fromParams, error) {
          event.preventDefault();

          $injector.get('MessageService')
            .error('Error Loading the page');

          $state.get('error').error = {
            event: event,
            toState: toState,
            toParams: toParams,
            fromState: fromState,
            fromParams: fromParams,
            error: error
          };

          return $state.go('error');
        });
      }
    })
  ;
}());


// var app = angular.module('app', ['ui.bootstrap', 'ui.router', 'ngMessages', 'app-templates'])
//  .run(function($rootScope, $state, Auth) {
//    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
//      if (!Auth.authorize(toState.data.access)) {
//        event.preventDefault();
//
//        $state.go('anon.login');
//      }
//    });
//  });