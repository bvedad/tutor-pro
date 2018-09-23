var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../../../auth');

router.post('/', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.likeReview(req.review._id).then(function () {
      return req.review.updateLikeCount().then(function (review) {
        return res.json(review.toJSONFor(user));
      });
    });
  }).catch(next);
});

router.delete('/', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.dislikeReview(req.review._id).then(function () {
      return req.review.updateLikeCount().then(function (review) {
        return res.json(review.toJSONFor(user));
      });
    });
  }).catch(next);
});

module.exports = router;
