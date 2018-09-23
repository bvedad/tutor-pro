function RegisterController($scope, $location, $http) {
    $scope.register = function () {
        $scope.validated = true;
        if (!$scope.registerForm.$valid) {
            return;
        }
        $http.post('api/users',
            {
                "username": $scope.user.username,
                "email": $scope.user.inputEmail,
                "password": $scope.user.inputPassword
            })
            .then((res) => {
                $location.path('/login');
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