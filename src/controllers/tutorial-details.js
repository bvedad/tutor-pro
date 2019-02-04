function TutorialDetailsController($scope, $http, $routeParams, $location, $q,Session, ApiConfig) {
  $scope.image = {};
  $scope.likeLoading = [];
  $scope.removeReview = [];

  //fetch tutorial details
  $http.get(`api/tutorials/${$routeParams.id}`, ApiConfig.get())
    .then((res) => {
      $scope.tutorial = res.data;
    });


  //fetch steps
  $http.get(`api/tutorials/${$routeParams.id}/steps`, ApiConfig.get())
  .then((res) => {
    $scope.steps = res.data;
  });

  //fetch reviews
  $http.get(`api/tutorials/${$routeParams.id}/reviews`, ApiConfig.get())
    .then((res) => {
      $scope.reviews = res.data;
    });

  //fetch images
  $http.get(`api/tutorials/${$routeParams.id}/images`, ApiConfig.get())
  .then((res) => {
    $scope.images = res.data;
  });
    
  $scope.postReview = () => {
    if($scope.postingReview) {
      return;
    }
    $scope.reviewValidated = true;
    if (!$scope.body) {
      return;
    }
    $scope.postingReview = true;
    $http.post(`api/tutorials/${$routeParams.id}/reviews`, {
      "body": $scope.body,
    }, ApiConfig.get())
      .then((res) => {
        $scope.reviews.push(res.data);
        $scope.body = null;
      })
      .finally(() => {
        $scope.reviewValidated = false;
        $scope.postingReview = false;
      })
  }

  $scope.startReviewEdit = (review, index) => {
    if($scope.editReviewPosition != null) {
      $scope.reviews[$scope.editReviewPosition] = $scope.reviews[$scope.editReviewPosition].old;
      $scope.reviews[$scope.editReviewPosition].old = undefined;
    }
    $scope.editReviewPosition = index;
    $scope.reviews[index].old = JSON.parse(JSON.stringify($scope.reviews[index]));
  }

  $scope.submitReview = (review, index) => {
    $http.put(`api/tutorials/${$routeParams.id}/reviews/${review._id}`, {
      "body": review.body,
    }, ApiConfig.get())
      .then((res) => {
        $scope.editReviewPosition = null;
        review = res.data.review;
      });
  }

  $scope.resetReview = (review, index) => {
    $scope.editReviewPosition = null;
    $scope.reviews[index] = $scope.reviews[index].old;
    $scope.reviews[index].old = undefined;
  }

  $scope.removeReview = (review, index) => {
    $scope.removeReview[index] = true;
    $http.delete(`api/tutorials/${$routeParams.id}/reviews/${review._id}`, ApiConfig.get())
      .then((res) => {
        $scope.editReviewPosition = null;
        $scope.reviews.splice(index, 1);
      })
      .finally(() => {
        $scope.removeReview[index] = false;
      })
  }

  $scope.toggleShowAddNewStep = () => {
    if($scope.addingStep) {
      return;
    }
    $scope.showAddNewStep = !$scope.showAddNewStep;
    if ($scope.showAddNewStep) {
      clearStepInput();
    }
  }

  $scope.addNewStep = () => {
    if($scope.addingStep) {
      return;
    }
    $scope.stepValidated = true;
    if (!$scope.stepTitle || !$scope.stepDescription || !$scope.stepLevel) {
      return;
    }
    $scope.addingStep = true;
    $http.post(`api/tutorials/${$routeParams.id}/steps`, {
      "title": $scope.stepTitle,
      "description": $scope.stepDescription,
      "level": $scope.stepLevel
    }, ApiConfig.get())
      .then((res) => {
        $scope.steps.steps.push(res.data);
        $scope.showAddNewStep = false;
        clearStepInput();
      })
      .finally(() => {
        $scope.stepValidated = false;
        $scope.addingStep = false;
      })
  }

  $scope.uploadImage = () => {
    var fd = new FormData();
    fd.append('image', $scope.image.src[0]);
    $http.post(`api/tutorials/${$routeParams.id}/images`, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': undefined,
        Authorization: 'Token ' + Session.get().token
      }
    })
      .then((res) => {
        $scope.images.push(res.data);
      })
      .finally(() => {
        $scope.image.src = null;
      })
  }

  $scope.cancelUpload = () => {
    $scope.image.src = null;
  }

  $scope.deleteImage = (image, index) => {
    
    $scope.imageLoading = index;
    $http.delete(`api/tutorials/${$routeParams.id}/images/${image._id}`, ApiConfig.get())
    .then((res) => {
      $scope.images.splice(index, 1);
    })
    .finally(() => {
      $scope.imageLoading = false;
    });
  }

  function clearStepInput() {
    $scope.stepTitle = null;
    $scope.stepDescription = null;
    $scope.stepLevel = null;
    $scope.stepValidated = false;
  }

  $scope.startStepEdit = (step, index) => {
    if($scope.editStepPosition != null) {
      $scope.steps.steps[$scope.editStepPosition] = $scope.steps.steps[$scope.editStepPosition].old;
      $scope.steps.steps[$scope.editStepPosition].old = undefined;
    }
    $scope.editStepPosition = index;
    $scope.steps.steps[index].old = JSON.parse(JSON.stringify($scope.steps.steps[index]));
  }

  $scope.submitStep = (step, index) => {
    $http.put(`api/tutorials/${$routeParams.id}/steps/${step._id}`, {
      "title": step.title,
      "description": step.description,
      "level": step.level
    }, ApiConfig.get())
      .then((res) => {
        $scope.editStepPosition = null;
        step = res.data.step;
      });
  }

  $scope.resetStep = (step, index) => {
    $scope.editStepPosition = null;
    $scope.steps.steps[index] = $scope.steps.steps[index].old;
    $scope.steps.steps[index].old = undefined;
  }

  $scope.removeStep = (step, index) => {
    $http.delete(`api/tutorials/${$routeParams.id}/steps/${step._id}`, ApiConfig.get())
      .then((res) => {
        $scope.editStepPosition = null;
        $scope.steps.steps.splice(index, 1);
      });
  }

  $scope.postFavorite = (state, index) => {
    let promise;
    if (state) {
      promise = $http.post(`api/tutorials/${$routeParams.id}/favorite`, null, ApiConfig.get());
    } else {
      promise = $http.delete(`api/tutorials/${$routeParams.id}/favorite`, ApiConfig.get());
    }
    $scope.favoriteLoading = true;
    promise
    .then((res) => {
      $scope.tutorial.favorited = state;
      $scope.tutorial.favoritesCount = res.data.favoritesCount;
    })
    .finally(() => {
      $scope.favoriteLoading = false;
    })
  }

  $scope.postLike = (state, index) => {
    let promise;
    $scope.likeLoading[index] = true;
    if (state) {
      promise = $http.post(`api/tutorials/${$routeParams.id}/reviews/${$scope.reviews[index]._id}/likes`, null, ApiConfig.get());
    } else {
      promise = $http.delete(`api/tutorials/${$routeParams.id}/reviews/${$scope.reviews[index]._id}/likes`, ApiConfig.get());
    }
    promise
    .then((res) => {
      $scope.reviews[index] = res.data;
    })
    .finally(() => {
      $scope.likeLoading[index] = false;
    })
  }

  $scope.deleteTutorial = () => {
    $http.delete(`api/tutorials/${$routeParams.id}`, ApiConfig.get())
      .then((res) => {
        $location.path('/tutorials');
      });
  }

  $scope.startEdit = (key, value) => {
    $scope.tutorial.old = {};
    $scope.tutorial.old[key] = value;
  }

  $scope.submitEdit = (key, value) => {
    let requestPayload = {};
    requestPayload[key] = value;
    $http.put(`api/tutorials/${$routeParams.id}`, requestPayload, ApiConfig.get())
      .catch(() => {
        $scope.tutorial[key] = $scope.tutorial.old[key];
      });
  }

  $scope.resetEdit = (key) => {
    $scope.tutorial[key] = $scope.tutorial.old[key];
    $scope.tutorial.old = undefined;
  }

  $scope.startEditTitle = () => {
    $scope.editTitle = true;
    $scope.startEdit('title', $scope.tutorial.title);
  }

  $scope.submitTitle = () => {
    $scope.editTitle = false;
    $scope.submitEdit('title', $scope.tutorial.title);
  }

  $scope.resetTitle = () => {
    $scope.editTitle = false;
    $scope.resetEdit('title');
  }

  $scope.startEditDescription = () => {
    $scope.editDescription = true;
    $scope.tutorial.old = {
      description: $scope.tutorial.description
    }
  }

  $scope.submitDescription = () => {
    $scope.editDescription = false;
    $http.put(`api/tutorials/${$routeParams.id}`, {
      "description": $scope.tutorial.description
    }, ApiConfig.get())
      .then((res) => {
        $scope.tutorial.description = res.data.description;
      })
      .finally(() => {
        $scope.tutorial.old = undefined;
      });
  }

  $scope.resetDescription = () => {
    $scope.editDescription = false;
    $scope.resetEdit('description'); 
  }
}