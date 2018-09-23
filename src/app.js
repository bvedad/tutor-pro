angular.module('tutorPro', ['ngRoute','ngCookies']);

angular.module('tutorPro', ['ngRoute','ngCookies']).run(function($rootScope, $location, Session, ApiConfig) {
    $rootScope.location = $location;
    $rootScope.Session = Session;
    $rootScope.formatDate = (time) => {
        let date = new Date(time);
        return `${date.getDate()} ${date.toLocaleString("en-us", { month: "short" })} ${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`
    }
    $rootScope.$on("$routeChangeStart", (event, next, current) => {
        if(Session.get()) {
            if(next.$$route.originalPath === '/register' || 
        next.$$route.originalPath === '/login') {
            $location.path('/tutorials');
            }
        } else if(next.$$route) {
            if(next.$$route.originalPath !== '/register' && 
            next.$$route.originalPath !== '/login') {
                $location.path('/login');
            }
        } else {
            $location.path('/login');
        }
    });
});

angular.module('tutorPro').directive("selectNgFiles", function() {
    return {
        require: "ngModel",
        link: function postLink(scope,elem,attrs,ngModel) {
            elem.on("change", function(e) {
                var files = elem[0].files;
                ngModel.$setViewValue(files);
            })
        }
    }
});
angular.module('tutorPro').service('fileUpload', ['$http', 'Session', function ($http, Session) {
    
}]);

angular.module('tutorPro').controller('TutorialListController', TutorialListController);
angular.module('tutorPro').controller('TutorialDetailsController', TutorialDetailsController);
angular.module('tutorPro').controller('TutorialPostController', TutorialPostController);
angular.module('tutorPro').controller('TutorProController', TutorProController);
angular.module('tutorPro').controller('RegisterController', RegisterController);
angular.module('tutorPro').controller('LoginController', LoginController);
angular.module('tutorPro').service('Session', Session);
angular.module('tutorPro').service('ApiConfig', ApiConfig);
angular.module('tutorPro').controller('TutorProController', TutorProController);



angular.module('tutorPro').config(function($routeProvider) {
    $routeProvider
    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterController'
    })
    .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
    .when('/tutorials', {
        templateUrl: 'views/tutorial-list.html',
        controller: 'TutorialListController'
    })
    .when('/tutorials/:id', {
        templateUrl: 'views/tutorial-details.html',
        controller: 'TutorialDetailsController'
    })
    .when('/tutorial-post', {
        templateUrl: 'views/tutorial-post.html',
        controller: 'TutorialPostController'
    })
    .when('/tutorial-detail/:id', {
        templateUrl: 'views/tutorial-detail.html',
        controller: 'TutorialDetailController'
    })
    .otherwise({
        templateUrl: 'views/404.html'
    })
});