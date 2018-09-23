var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
  body: { type: String },
  image: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' },
}, { timestamps: true });

ImageSchema.methods.toJSONFor = function(user){
  return {
    _id: this._id,
    name: this.name,
    body: this.body,
    image: this.image,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isAuthor: user._id.equals(this.author._id)
  };
};

mongoose.model('Image', ImageSchema);
