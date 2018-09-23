var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Step = mongoose.model('Step');
var auth = require('../../auth');

router.param('step', function(req, res, next) {
  Step.findById(req.params.step)
  .populate('author')
  .then(function(step){
    if(!step) { return res.sendStatus(404); }
    req.step = step;
    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next){
    return Promise.all([
      Step.find({ tutorial: req.tutorial.id})
        .sort({ createdAt: 'desc' })
        .populate('author')
        .exec(),
      Step.count({ tutorial: req.tutorial.id}).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function (results) {
      var steps = results[0];
      var stepsCount = results[1];
      var user = results[2];
      return res.json({
        steps: steps,
        stepsCount: stepsCount
      });
    }).catch(next);
  });

router.get('/:step', auth.required, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
  .then(function(user){
    if(!user) {
      return res.sendStatus(401);
    }
    return res.json(req.step.toJSON());
  }).catch(next);
});

// create a new step
router.post('/', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if(req.tutorial.author._id.toString() === req.payload.id.toString()) {
      if(!user){ return res.sendStatus(401); }
      var step = new Step();
      step.title = req.body.title;
      step.description = req.body.description;
      step.level = req.body.level;
      step.tutorial = req.tutorial;
      step.author = user;
      return step.save().then(function(){
        req.tutorial.steps.push(step);
        return req.tutorial.save().then(function(tutorial) {
          res.json(step.toJSON());
        });
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

router.put('/:step', auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user) {
    if(!user) {
      return res.sendStatus(401);
    }
    if(req.tutorial.author._id.equals(req.payload.id.toString())) {
      if(typeof req.body.title !== 'undefined'){
        req.step.title = req.body.title;
      }
      if(typeof req.body.description !== 'undefined'){
        req.step.description = req.body.description;
      }
      if(typeof req.body.level !== 'undefined'){
        req.step.level = req.body.level;
      }

      req.step.save().then(function(step){
        return res.json(step.toJSON());
      }).catch(next);
    }
    else {
      return res.sendStatus(403);
    }
  });
}
);

router.delete('/:step', auth.required, function(req, res, next) {
  if(req.step.author._id.toString() === req.payload.id.toString()){
    req.tutorial.steps.remove(req.step._id);
    req.tutorial.save()
      .then(Step.find({_id: req.step._id}).remove().exec())
      .then(function(){
        res.sendStatus(204);
      });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;