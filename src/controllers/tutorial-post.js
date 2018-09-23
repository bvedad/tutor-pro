function TutorialPostController($scope, $http, $location, Session, ApiConfig) {
  $scope.location = $location;
  $scope.tutorial = {
    steps: [
      {
        title: '',
        description: '',
        level: null
      }
    ]
  };

  $scope.createTutorial = () => {
    if (!$scope.validate()) {
      return;
    }
    $http.post('api/tutorials', {
      "title": $scope.tutorial.title,
      "description": $scope.tutorial.description,
      "steps": $scope.tutorial.steps
    }, ApiConfig.get())
      .then((res) => {
        $scope.location.path(`/tutorials/${res.data._id}`);
      })
      .catch((e) => {
        let keys = Object.keys(e.data.errors);
        let message = '';
        keys.forEach((key) => {
          message += key.charAt(0).toUpperCase() + key.slice(1) + ' ' + e.data.errors[key] + '\n';
        });
        $scope.errorMessage = message;
      });
  };

  $scope.validate = () => {
    $scope.validated = true;
    const post = $scope.tutorial;
    return $scope.validateSteps($scope.tutorial.steps) && post.title && post.description;
  }

  $scope.addNewStep = (index) => {
    $scope.tutorial.steps.push({
      title: '',
      description: '',
      level: null
    })
  }

  $scope.validateSteps = (steps) => {
    $scope.notValidSteps = [];
    return steps.every((step, index) => {
      return step.title && step.description && step.level;
    });
  }

  $scope.removeStep = (index) => {
    $scope.tutorial.steps.splice(index, 1);
  }
}