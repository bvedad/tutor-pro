function LoginController($scope, $http, $location, Session) {
    $scope.login = function () {
        $scope.validated = true;
        if (!$scope.loginForm.$valid) {
            return;
        }
        $scope.errorMessage = null;
        $http
            .post('api/users/login', {
                email: $scope.user.inputEmail,
                password: $scope.user.inputPassword
            })
            .then(function (res) {
                Session.create(res.data);
                $location.path('/tutorials');
            })
            .catch((e) => {
                let keys = Object.keys(e.data.errors);
                let message = '';
                keys.forEach((key) => {
                    message += key.charAt(0).toUpperCase() + key.slice(1) + ' ' + e.data.errors[key] + '\n';
                });
                $scope.errorMessage = message;
            });
    }
}

