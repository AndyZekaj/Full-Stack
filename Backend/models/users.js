import {Schema, model} from 'mongoose';
import v from 'validator';
import bcrypt from "bcryptjs";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (name_value) {
        return v.matches(name_value, /^[A-Za-z\s]+$/);
      },
      message: "Name is not valid",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email_value) {
        return v.isEmail(email_value);
      },
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password_value) {
        // length >= 8 atLeast 1UpperCase   1LowerCase  1Digit 1Symbol
        return v.isStrongPassword(password_value, {
          minLength: 8,
          minUppercase: 1,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message:
        "Valid password should contains 8char length, atLeast 1UpperCase   1LowerCase  1Digit 1Symbol",
    },
  },
  verified: {
    type: Date,
    default: null
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'editor', 'guest'],
    default: 'guest'
  }
});

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
})


// middleware
userSchema.pre('save', async function(next){
  try {

    if(!this.isModified('password')){
      next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
  } catch (error) {
    next(error)
  }
});

// method to clear user from un-necessary data
userSchema.methods.clean = function(){
  const user = this.toObject();
  delete user.password;
  delete user.__v;

  return user;
}

const User = model('User', userSchema);
export const VToken = model('VToken', tokenSchema);
export default User;