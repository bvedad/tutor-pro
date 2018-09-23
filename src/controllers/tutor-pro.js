function TutorProController($scope, $location, Session) {

    $scope.logout = function() {
        Session.destroy();
        $location.path('/login');
    }
}
