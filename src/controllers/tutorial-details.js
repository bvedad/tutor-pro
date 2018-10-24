function TutorialDetailsController($scope, $http, $routeParams, $location, $q,Session, ApiConfig) {
  $scope.image = {};

  //fetch tutorial details
  $http.get(`api/tutorials/${$routeParams.id}`, ApiConfig.get())
    .then((res) => {
      $scope.tutorial = res.data;
      console.log('Is author: ', $scope.tutorial.isAuthor);
    })
    .catch((e) => {
      //todo bvedad show error
    });


  //fetch steps
  $http.get(`api/tutorials/${$routeParams.id}/steps`, ApiConfig.get())
  .then((res) => {
    $scope.steps = res.data;
  })
  .catch((e) => {
    //todo bvedad show error
  });

  //fetch reviews
  $http.get(`api/tutorials/${$routeParams.id}/reviews`, ApiConfig.get())
    .then((res) => {
      $scope.reviews = res.data;
    })
    .catch((e) => {
      //todo bvedad show error
    });

  //fetch images
  $http.get(`api/tutorials/${$routeParams.id}/images`, ApiConfig.get())
  .then((res) => {
    $scope.images = res.data;
  })
  .catch((e) => {
    //todo bvedad show error
  })
    
  $scope.postReview = () => {
    $scope.reviewValidated = true;
    if (!$scope.body) {
      return;
    }
    $http.post(`api/tutorials/${$routeParams.id}/reviews`, {
      "body": $scope.body,
    }, ApiConfig.get())
      .then((res) => {
        $scope.reviews.push(res.data);
        $scope.body = null;
      })
      .catch(() => {
        //todo bvedad show error
      })
      .finally(() => {
        $scope.reviewValidated = false;
      })
  }

  $scope.startReviewEdit = (review, index) => {
    $scope.editReviewPosition = index;
    review.old = review.body.toString();
  }

  $scope.submitReview = (review, index) => {
    $http.put(`api/tutorials/${$routeParams.id}/reviews/${review._id}`, {
      "body": review.body,
    }, ApiConfig.get())
      .then((res) => {
        $scope.editReviewPosition = null;
        review = res.data.review;
      })
      .catch((e) => {
        //todo bvedad show error message
      })
  }

  $scope.resetReview = (review, index) => {
    $scope.editReviewPosition = null;
    review.old = undefined;
  }

  $scope.removeReview = (review, index) => {
    $http.delete(`api/tutorials/${$routeParams.id}/reviews/${review._id}`, ApiConfig.get())
      .then((res) => {
        $scope.editReviewPosition = null;
        $scope.reviews.splice(index, 1);
      })
      .catch((e) => {
        //todo bvedad show error message
      })
  }

  $scope.toggleShowAddNewStep = () => {
    $scope.showAddNewStep = !$scope.showAddNewStep;
    if ($scope.showAddNewStep) {
      clearStepInput();
    }
  }

  $scope.addNewStep = () => {
    $scope.stepValidated = true;
    if (!$scope.stepTitle || !$scope.stepDescription || !$scope.stepLevel) {
      return;
    }
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
      .catch((e) => {
        //todo bvedad show error
      })
      .finally(() => {
        $scope.stepValidated = false;
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
      .catch((e) => {
        //todo bvedad show error
      })
  }

  $scope.deleteImage = (image, index) => {
    
    $scope.imageLoading = index;
    $http.delete(`api/tutorials/${$routeParams.id}/images/${image._id}`, ApiConfig.get())
    .then((res) => {
      $scope.images.splice(index, 1);
    })
    .catch((e) => {
      //todo bvedad show error
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
    $scope.editStepPosition = index;
    step.old = step;
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
      })
      .catch((e) => {
        //todo bvedad show error message
      })
  }

  $scope.resetStep = (step, index) => {
    $scope.editStepPosition = null;
    step.old = undefined;
  }

  $scope.removeStep = (step, index) => {
    $http.delete(`api/tutorials/${$routeParams.id}/steps/${step._id}`, ApiConfig.get())
      .then((res) => {
        $scope.editStepPosition = null;
        $scope.steps.steps.splice(index, 1);
      })
      .catch((e) => {
        //todo bvedad show error message
      })
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
    .catch((e) => {
      //todo bvedad show error message
    })
    .finally(() => {
      $scope.favoriteLoading = false;
    })
  }

  $scope.postLike = (state, index) => {
    let promise;
    $scope.likeLoading = true;
    if (state) {
      promise = $http.post(`api/tutorials/${$routeParams.id}/reviews/${$scope.reviews[index]._id}/likes`, null, ApiConfig.get());
    } else {
      promise = $http.delete(`api/tutorials/${$routeParams.id}/reviews/${$scope.reviews[index]._id}/likes`, ApiConfig.get());
    }
    promise
    .then((res) => {
      $scope.reviews[index] = res.data;
    })
    .catch((e) => {
      //todo bvedad show error message
    })
    .finally(() => {
      $scope.likeLoading = false;
    })
  }

  $scope.deleteTutorial = () => {
    $http.delete(`api/tutorials/${$routeParams.id}`, ApiConfig.get())
      .then((res) => {
        $location.path('/tutorials');
      })
      .catch((e) => {
        //todo bvedad show error message
      })
  }

  $scope.startEdit = (key, value) => {
    $scope.tutorial.old = {};
    $scope.tutorial.old[key] = value;
  }

  $scope.submitEdit = (key, value) => {
    $http.put(`api/tutorials/${$routeParams.id}`, {
      key: value
    }, ApiConfig.get())
      .then((res) => {
        $scope.tutorial[key] = value;
      })
      .catch((e) => {
        //todo bvedad show error message
        $scope.tutorial[key] = $scope.tutorial.old[key];
      })
      .finally(() => {
        $scope.tutorial.old = undefined;
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
      .catch((e) => {
        //todo bvedad show error message
        $scope.tutorial.description = $scope.tutorial.old.description;
      })
      .finally(() => {
        $scope.tutorial.old = undefined;
      });
  }

  $scope.resetDescription = () => {
    $scope.editDescription = false;
    $scope.tutorial.description = $scope.tutorial.old.description;
    $scope.tutorial.old.description = undefined;
  }
}