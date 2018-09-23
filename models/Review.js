var mongoose = require('mongoose');
var User = mongoose.model('User');

var ReviewSchema = new mongoose.Schema({
  body: String,
  likesCount: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }
}, { timestamps: true });

ReviewSchema.methods.toJSONFor = function(user){
  return {
    _id: this._id,
    body: this.body,
    author: this.author.toProfileJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isAuthor: user._id.equals(this.author._id),
    likesCount: this.likesCount,
    liked: user ? user.isLiked(this._id) : false
  };
};

ReviewSchema.methods.updateLikeCount = function () {
  var review = this;

  return User.count({ likedReviews: { $in: [review._id] } }).then(function (count) {
    review.likesCount = count;
    return review.save();
  });
};

mongoose.model('Review', ReviewSchema);
