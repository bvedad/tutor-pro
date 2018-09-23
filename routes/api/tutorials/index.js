const router = require('express').Router();
const mongoose = require('mongoose');
const Tutorial = mongoose.model('Tutorial');
const User = mongoose.model('User');
const Step = mongoose.model('Step');
const auth = require('../../auth');

// Preload article objects on routes with ':article'
router.param('tutorial', function (req, res, next, slug) {
  Tutorial.findOne({ _id: req.params.tutorial })
    .populate('author')
    .then(function (tutorial) {
      if (!tutorial) { return res.sendStatus(404); }

      req.tutorial = tutorial;

      return next();
    }).catch(next);
});

router.get('/', auth.optional, function (req, res, next) {
  var query = {};
  var limit = 20;
  var page = 1;
  if (typeof req.query.limit !== 'undefined') {
    limit = req.query.limit;
  }

  if (typeof req.query.page !== 'undefined') {
    page = req.query.page;
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    req.query.favorited ? User.findOne({ username: req.query.favorited }) : null
  ]).then(function (results) {
    var author = results[0];
    var favoriter = results[1];

    if (author) {
      query.author = author._id;
    }

    if (favoriter) {
      query._id = { $in: favoriter.favorites };
    } else if (req.query.favorited) {
      query._id = { $in: [] };
    }

    return Promise.all([
      Tutorial.find(query)
        .limit(Number(limit))
        .skip(Number((page - 1) * limit))
        .sort({ createdAt: 'desc' })
        .populate('author')
        .exec(),
      Tutorial.count(query).exec(),
      req.payload ? User.findById(req.payload.id) : null,
    ]).then(function (results) {
      var tutorials = results[0];
      var tutorialsCount = results[1];
      var user = results[2];
      return res.json({
        tutorials: tutorials.map(function (tutorial) {
          return tutorial.toJSONFor(user);
        }),
        tutorialsCount: tutorialsCount,
        pages: Math.ceil(tutorialsCount/limit),
        page: Number(page)
      });
    });
  }).catch(next);
});

router.post('/', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }
    var tutos = new Tutorial();
    tutos.title = req.body.title;
    tutos.description = req.body.description;
    tutos.author = user;
    tutos.steps = [];    
    return tutos.save().then((tutorial) => {
      req.body.steps.forEach(element => {
        var step = new Step();
        step.title = element.title;
        step.description = element.description;
        step.level = element.level;
        step.tutorial = req.tutorial;
        step.author = user;
        step.save();
        tutorial.steps.push(step);
      });
      tutorial.save().then(() => {
        return res.json(tutorial.toJSONFor(user));
      });
    });
  }).catch(next);
});

// return a tutorial
router.get('/:tutorial', auth.optional, function (req, res, next) {
  Promise.all([
    req.payload ? User.findById(req.payload.id) : null,
    Tutorial.findOne({ _id: req.tutorial._id })
    .populate('author')
    .populate('steps')
  ])
    .then(function (results) {
      return res.json(results[1].toJSONFor(results[0]));
    }).catch(next);
});

// update tutorial
router.put('/:tutorial', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (req.tutorial.author._id.toString() === req.payload.id.toString()) {
      if (typeof req.body.title !== 'undefined') {
        req.tutorial.title = req.body.title;
      }

      if (typeof req.body.description !== 'undefined') {
        req.tutorial.description = req.body.description;
      }

      if (typeof req.body.body !== 'undefined') {
        req.tutorial.body = req.body.body;
      }

      req.tutorial.save().then(function (tutorial) {
        return res.json(tutorial.toJSONFor(user));
      }).catch(next);
    } else {
      return res.sendStatus(403);
    }
  });
});

// delete tutorial
router.delete('/:tutorial', auth.required, function (req, res, next) {
  User.findById(req.payload.id).then(function (user) {
    if (!user) { return res.sendStatus(401); }

    if (req.tutorial.author._id.toString() === req.payload.id.toString()) {
      return req.tutorial.remove().then(function () {
        return res.sendStatus(204);
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

router.use('/:tutorial/reviews', require('./reviews'));
router.use('/:tutorial/steps', require('./steps'));
router.use('/:tutorial/favorite', require('./favorite'));
router.use('/:tutorial/images', require('./images'));

module.exports = router;
