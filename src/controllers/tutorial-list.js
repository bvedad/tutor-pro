function TutorialListController($scope, $http, $routeParams, $location) {
    if(!$routeParams.page) {
        $location.path(`/tutorials`).search('page', 1);
    }
    $http.get(`api/tutorials?page=${$routeParams.page}`)
    .then((res) => {
        $scope.tutorials = res.data;
    });

    $scope.loadPage = (page) => {
        if(page === $scope.tutorials.page || page < 1 || page > $scope.tutorials.pages) {
            return;
        }
        $location.path(`/tutorials`).search('page', page);
    }
}