const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요.'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, '올바른 이메일 형식이 아닙니다.']
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요.'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다.']
  },
  name: {
    type: String,
    required: [true, '이름을 입력해주세요.'],
    trim: true,
    maxlength: [50, '이름은 최대 50자까지 입력 가능합니다.']
  },
  birthDate: {
    year: Number,
    month: Number,
    day: Number,
    hour: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'monthly', 'yearly'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: Date,
    endDate: Date
  },
  credits: {
    type: Number,
    default: 3  // 무료 사용자 기본 3회
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 비밀번호 해싱 (저장 전)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 비밀번호 비교 메서드
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('비밀번호 비교 중 오류가 발생했습니다.');
  }
};

// JSON 응답 시 비밀번호 제외
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
