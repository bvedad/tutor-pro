var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var auth = require('../../../auth');

router.param('review', function(req, res, next) {
  Review.findOne({ _id: req.params.review})
  .populate('author')
  .then(function(review){
    if(!review) { return res.sendStatus(404); }
    req.review = review;
    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.tutorial.populate({
      path: 'reviews',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(tutorial) {
      return res.json(req.tutorial.reviews.map(function(review){
        return review.toJSONFor(user);
      }));
    });
  }).catch(next);
});

router.get('/:review', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
  .then(function(user){
      return res.json(req.review.toJSONFor(user));
    }).catch(next);
});

// create a new review
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    var review = new Review();
    review.body = req.body.body;
    review.tutorial = req.tutorial;
    review.author = user;
    return review.save().then(function(){
      req.tutorial.reviews.push(review);
      return req.tutorial.save().then(function(tutorial) {
        res.json(review.toJSONFor(user));
      });
    });
  }).catch(next);
});

router.put('/:review', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if(typeof req.body.body !== 'undefined'){
      req.review.body = req.body.body;
    }
    req.review.save().then(function(review){
      return res.json(review.toJSONFor(user));
    }).catch(next);
  });
}
);

router.delete('/:review', auth.required, function(req, res, next) {
  if(req.review.author._id.toString() === req.payload.id.toString()){
    req.tutorial.reviews.remove(req.review._id);
    req.tutorial.save()
      .then(Review.find({_id: req.review._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

router.use('/:review/likes', require('./likes'));

module.exports = router;