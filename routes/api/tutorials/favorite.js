var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var auth = require('../../auth');

router.post('/', auth.required, function (req, res, next) {

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.favorite(req.tutorial._id).then(function () {
      return req.tutorial.updateFavoriteCount().then(function (tutorial) {
        return res.json(tutorial.toJSONFor(user));
      });
    });
  }).catch(next);
});

router.delete('/', auth.required, function (req, res, next) {
  var tutorialId = req.tutorial._id;

  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    return user.unfavorite(tutorialId).then(function () {
      return req.tutorial.updateFavoriteCount().then(function (tutorial) {
        return res.json(tutorial.toJSONFor(user));
      });
    });
  }).catch(next);
});

module.exports = router;
