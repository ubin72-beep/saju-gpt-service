const Subscription = require('../models/Subscription');
const User = require('../models/User');

// 구독 플랜 목록 조회
exports.getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: '무료 체험',
        price: 0,
        currency: 'KRW',
        duration: '영구',
        features: {
          analysisLimit: 3,
          unlimitedAnalysis: false,
          aiChat: false,
          premiumReports: false,
          prioritySupport: false
        },
        description: '회원가입 시 무료 3회 제공'
      },
      {
        id: 'monthly',
        name: '월간 구독',
        price: 19900,
        currency: 'KRW',
        duration: '1개월',
        features: {
          analysisLimit: -1,  // 무제한
          unlimitedAnalysis: true,
          aiChat: true,
          premiumReports: true,
          prioritySupport: false
        },
        description: '무제한 사주 분석 + AI 챗봇 상담'
      },
      {
        id: 'yearly',
        name: '연간 구독',
        price: 199000,
        currency: 'KRW',
        duration: '1년',
        features: {
          analysisLimit: -1,  // 무제한
          unlimitedAnalysis: true,
          aiChat: true,
          premiumReports: true,
          prioritySupport: true
        },
        description: '무제한 사주 분석 + AI 챗봇 상담 + 우선 지원',
        discount: '월간 대비 17% 할인'
      }
    ];

    res.status(200).json({
      success: true,
      data: { plans }
    });

  } catch (error) {
    console.error('구독 플랜 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 플랜 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 내 구독 정보 조회
exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        data: {
          subscription: null,
          message: '활성 구독이 없습니다.'
        }
      });
    }

    // 만료 여부 확인
    if (subscription.isExpired()) {
      subscription.status = 'expired';
      await subscription.save();

      return res.status(200).json({
        success: true,
        data: {
          subscription,
          message: '구독이 만료되었습니다.'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        subscription,
        daysRemaining: subscription.getDaysRemaining()
      }
    });

  } catch (error) {
    console.error('구독 정보 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 정보 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 구독 생성
exports.createSubscription = async (req, res) => {
  try {
    const { plan, paymentInfo } = req.body;

    if (!plan || !['monthly', 'yearly'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 구독 플랜입니다.'
      });
    }

    // 기존 활성 구독 확인
    const existingSubscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active'
    });

    if (existingSubscription && !existingSubscription.isExpired()) {
      return res.status(400).json({
        success: false,
        message: '이미 활성화된 구독이 있습니다.'
      });
    }

    // 구독 기간 및 가격 계산
    const pricing = {
      monthly: { amount: 19900, months: 1 },
      yearly: { amount: 199000, months: 12 }
    };

    const planInfo = pricing[plan];
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + planInfo.months);

    // 구독 생성
    const subscription = await Subscription.create({
      userId: req.user.id,
      plan,
      status: 'active',
      pricing: {
        amount: planInfo.amount,
        currency: 'KRW'
      },
      startDate,
      endDate,
      autoRenew: true,
      paymentInfo: {
        ...paymentInfo,
        paidAt: new Date(),
        lastPaymentDate: new Date(),
        nextBillingDate: endDate
      },
      features: {
        unlimitedAnalysis: true,
        aiChat: true,
        premiumReports: true,
        prioritySupport: plan === 'yearly'
      }
    });

    // 사용자 구독 정보 업데이트
    const user = await User.findById(req.user.id);
    user.subscription.plan = plan;
    user.subscription.status = 'active';
    user.subscription.startDate = startDate;
    user.subscription.endDate = endDate;
    await user.save();

    res.status(201).json({
      success: true,
      message: '구독이 시작되었습니다.',
      data: { subscription }
    });

  } catch (error) {
    console.error('구독 생성 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 생성 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 구독 취소
exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'active'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: '활성화된 구독을 찾을 수 없습니다.'
      });
    }

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    subscription.cancelledAt = new Date();
    subscription.cancelReason = req.body.reason || '사용자 요청';
    await subscription.save();

    // 사용자 구독 정보 업데이트
    const user = await User.findById(req.user.id);
    user.subscription.status = 'cancelled';
    await user.save();

    res.status(200).json({
      success: true,
      message: '구독이 취소되었습니다. 구독 기간까지는 계속 이용 가능합니다.',
      data: { subscription }
    });

  } catch (error) {
    console.error('구독 취소 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 취소 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 구독 재개
exports.renewSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.user.id,
      status: 'cancelled'
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: '취소된 구독을 찾을 수 없습니다.'
      });
    }

    subscription.status = 'active';
    subscription.autoRenew = true;
    subscription.cancelledAt = null;
    subscription.cancelReason = null;
    await subscription.save();

    // 사용자 구독 정보 업데이트
    const user = await User.findById(req.user.id);
    user.subscription.status = 'active';
    await user.save();

    res.status(200).json({
      success: true,
      message: '구독이 재개되었습니다.',
      data: { subscription }
    });

  } catch (error) {
    console.error('구독 재개 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 재개 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

// 구독 히스토리 조회
exports.getSubscriptionHistory = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { subscriptions }
    });

  } catch (error) {
    console.error('구독 히스토리 조회 에러:', error);
    res.status(500).json({
      success: false,
      message: '구독 히스토리 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};
