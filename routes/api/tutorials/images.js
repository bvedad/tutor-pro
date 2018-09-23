const router = require('express').Router();
const mongoose = require('mongoose');
const multer = require('multer');
const Image = mongoose.model('Image');
const User = mongoose.model('User');
const auth = require('../../auth');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './images/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3
  },
  fileFilter: fileFilter
});


router.param('image', function(req, res, next) {
  Image.findOne({ _id: req.params.image})
  .populate('author')
  .then(function(image){
    if(!image) { return res.sendStatus(404); }
    req.image = image;
    return next();
  }).catch(next);
});

router.get('/', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null).then(function(user){
    return req.tutorial.populate({
      path: 'images',
      populate: {
        path: 'author'
      },
      options: {
        sort: {
          createdAt: 'desc'
        }
      }
    }).execPopulate().then(function(tutorial) {
      return res.json(req.tutorial.images.map(function(image){
        return image.toJSONFor(user);
      }));
    });
  }).catch(next);
});

router.get('/:image', auth.optional, function(req, res, next){
  Promise.resolve(req.payload ? User.findById(req.payload.id) : null)
  .then(function(user){
      return res.json(req.image.toJSONFor(user));
    }).catch(next);
});

router.post('/', upload.single('image'), auth.required, function(req, res, next) {
  User.findById(req.payload.id).then(function(user){
    if(!user){ return res.sendStatus(401); }
    if(req.tutorial.author._id.toString() === req.payload.id.toString()) {
      var image = new Image();
      image.name = req.body.name;
      image.body = req.body.body;
      image.tutorial = req.tutorial;
      image.author = user;
      image.image = req.file.path;
      image.tutorial = req.tutorial;
      image.author = user;
      return image.save().then(function(){
        req.tutorial.images.push(image);
        return req.tutorial.save().then(function(tutorial) {
          res.json(image.toJSONFor(user));
        });
      });
    } else {
      return res.sendStatus(403);
    }
  }).catch(next);
});

router.delete('/:image', auth.required, function(req, res, next) {
  if(req.image.author._id.toString() === req.payload.id.toString()){
    const imagePath = req.image.image;
    req.tutorial.images.remove(req.image._id);
    req.tutorial.save()
      .then(Image.find({_id: req.image._id}).remove().exec())
      .then(function(){
        fs.unlink(imagePath, (err) => {
          if (err) {
            throw err;
          }
          res.sendStatus(204);
        });
      });
  } else {
    res.sendStatus(403);
  }
});


module.exports = router;