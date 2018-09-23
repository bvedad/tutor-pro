var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });

var StepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tutorial: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutorial' }
}, {timestamps: true});

StepSchema.methods.toJSON = function(){
  return {
    _id: this._id,
    title: this.title,
    description: this.description,
    level: this.level,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

mongoose.model('Step', StepSchema);
