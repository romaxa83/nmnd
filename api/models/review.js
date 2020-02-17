const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a review title'],
        trim: true,
        maxLength: [50, 'Name can not be more than 50 characters']
    },
    text: {
        type: String,
        required: [true, 'Please add a text for review'],
        maxLength: [505, 'Description can not be more than 500 characters']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // relations with bootcamp
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    // relations with user
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// на каждый лагерь,каждый пользователь может оставить только один отзыв
ReviewSchema.index({ bootcamp: 1, user: 1 }, {unique: true});


// Static method to get avg of reviews rating
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    console.log('Calculating avg rating by reviews ...'.blue);

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (err) {
        console.log(err);
    }
};

// Cal getAverageRating after save
ReviewSchema.post('save', function(){
    this.constructor.getAverageRating(this.bootcamp);
});

// Cal getAverageRating before remove
ReviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);