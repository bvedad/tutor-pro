var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var User = mongoose.model('User');

var TutorialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  favoritesCount: { type: Number, default: 0 },
  steps: [{type: mongoose.Schema.Types.ObjectId, ref: 'Step'}, {usePushEach: true}],
  reviews: [{type: mongoose.Schema.Types.ObjectId, ref: 'Review'}],
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image'}],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {timestamps: true});

TutorialSchema.plugin(uniqueValidator, { message: 'is already taken' });

TutorialSchema.methods.updateFavoriteCount = function () {
  var tutorial = this;

  return User.count({ favorites: { $in: [tutorial._id] } }).then(function (count) {
    tutorial.favoritesCount = count;
    return tutorial.save();
  });
};

TutorialSchema.methods.toJSONFor = function (user) {
  return {
    title: this.title,
    description: this.description,
    topic: this.topic,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author,
    isAuthor: user ? user._id.equals(this.author._id) : null,
    images: this.images,
    _id: this._id
  };
};

mongoose.model('Tutorial', TutorialSchema);
