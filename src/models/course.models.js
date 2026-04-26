import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
    title:{
        type: String,
        trim: true,
        required: true,
    },
    label:{
        type: String,
        trim: true,
        required: true,
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true,
        min: [0, "Price must be a positive number"]
    },
    discountPercent:{
        type: Number,
        min: [0, "Discount cannot be less than 0"],
        max: [100, "Discount cannot be more than 100"],
        default: 0
    },
    payableAmount:{
        type: Number,
    },
    averageRating:{
        type: Number,
        min: [0, "Rating cannot be less than 0"],
        max: [10, "Rating cannot be more than 10"],
        default: 0
    },
    totalRatings:{
        type: Number,
        default: 0
    },
    totalReviews:{
        type: Number,
        default: 0
    },
    thumbnail:{
        type:[
            {
                url: String,
                mimetype: String,
                size: Number
            }
        ],
        default:[],
    },
    subjects:[{
        type: Schema.Types.ObjectId,
        ref: "Subject"
    }],
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true  
    },

},
{timestamps: true}
);

courseSchema.statics.calculatePayableAmount = function({totalPrice, discountPercent}){
    const discountAmount = (totalPrice * discountPercent) / 100;
    return Math.max(0, totalPrice - discountAmount);
}

export const Course = mongoose.model("Course",courseSchema);