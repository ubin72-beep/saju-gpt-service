const User = require('../models/User');
const SajuAnalysis = require('../models/SajuAnalysis');
const Subscription = require('../models/Subscription');

/**
 * @desc    관리자 대시보드 통계 조회 (그래프 없음, 숫자 카드만)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // 1. 총 회원 수 (전체)
    const totalUsers = await User.countDocuments({ isActive: true });
    
    // 2. 이번 달 신규 회원
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: monthStart },
      isActive: true
    });
    
    // 3. 지난달 신규 회원 (증감율 계산용)
    const newUsersLastMonth = await User.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
      isActive: true
    });
    
    // 증감율 계산
    const userGrowthRate = newUsersLastMonth > 0 
      ? (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1)
      : 100;

    // 4. 오늘 방문자 (오늘 로그인한 회원 수)
    const todayVisitors = await User.countDocuments({
      lastLogin: { $gte: todayStart }
    });

    // 5. 어제 방문자 (증감율 계산용)
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayVisitors = await User.countDocuments({
      lastLogin: { $gte: yesterdayStart, $lt: todayStart }
    });
    
    const visitorGrowthRate = yesterdayVisitors > 0
      ? (((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100).toFixed(1)
      : 100;

    // 6. 프리미엄 회원 수
    const premiumMembers = await User.countDocuments({
      'subscription.plan': { $in: ['monthly', 'annual', 'premium'] },
      'subscription.endDate': { $gte: now },
      isActive: true
    });
    
    // 7. 지난달 프리미엄 회원 (증감율 계산용)
    const premiumMembersLastMonth = await User.countDocuments({
      'subscription.plan': { $in: ['monthly', 'annual', 'premium'] },
      'subscription.startDate': { $gte: lastMonthStart, $lt: lastMonthEnd }
    });
    
    const premiumGrowthRate = premiumMembersLastMonth > 0
      ? (((premiumMembers - premiumMembersLastMonth) / premiumMembersLastMonth) * 100).toFixed(1)
      : 100;

    // 8. 이번 달 매출 (구독 결제 총액)
    const monthlyRevenue = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart },
          status: 'active'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$finalAmount' }
        }
      }
    ]);
    
    const thisMonthRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;
    
    // 9. 지난달 매출 (증감율 계산용)
    const lastMonthRevenue = await Subscription.aggregate([
      {
        $match: {
          createdAt: { $gte: lastMonthStart, $lt: lastMonthEnd },
          status: 'active'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$finalAmount' }
        }
      }
    ]);
    
    const lastMonthRevenueAmount = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].total : 0;
    
    const revenueGrowthRate = lastMonthRevenueAmount > 0
      ? (((thisMonthRevenue - lastMonthRevenueAmount) / lastMonthRevenueAmount) * 100).toFixed(1)
      : 100;

    // 10. 사주 분석 총 건수
    const totalSajuAnalysis = await SajuAnalysis.countDocuments();
    
    // 11. 이번 달 사주 분석 건수
    const thisMonthSaju = await SajuAnalysis.countDocuments({
      createdAt: { $gte: monthStart }
    });

    // 12. 최근 가입 회원 (5명)
    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt subscription.plan');

    // 13. 최근 구독 (5건)
    const recentSubscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('plan amount status createdAt userId');

    // 14. 인기 서비스 (사주 분석 유형별 통계)
    const popularServices = await SajuAnalysis.aggregate([
      {
        $group: {
          _id: '$analysisType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        // 메인 통계 카드 (4개)
        mainStats: {
          totalUsers: {
            value: totalUsers,
            change: `+${userGrowthRate}%`,
            trend: parseFloat(userGrowthRate) >= 0 ? 'up' : 'down',
            label: '총 회원 수'
          },
          todayVisitors: {
            value: todayVisitors,
            change: `+${visitorGrowthRate}%`,
            trend: parseFloat(visitorGrowthRate) >= 0 ? 'up' : 'down',
            label: '오늘 방문자'
          },
          monthlyRevenue: {
            value: thisMonthRevenue,
            change: `+${revenueGrowthRate}%`,
            trend: parseFloat(revenueGrowthRate) >= 0 ? 'up' : 'down',
            label: '이번 달 매출',
            formatted: `₩${thisMonthRevenue.toLocaleString()}`
          },
          premiumMembers: {
            value: premiumMembers,
            change: `+${premiumGrowthRate}%`,
            trend: parseFloat(premiumGrowthRate) >= 0 ? 'up' : 'down',
            label: '프리미엄 회원'
          }
        },
        
        // 추가 통계
        additionalStats: {
          newUsersThisMonth: {
            value: newUsersThisMonth,
            label: '이번 달 신규 회원'
          },
          totalSajuAnalysis: {
            value: totalSajuAnalysis,
            label: '총 사주 분석 건수'
          },
          thisMonthSaju: {
            value: thisMonthSaju,
            label: '이번 달 사주 분석'
          }
        },
        
        // 최근 활동
        recentActivity: {
          recentUsers: recentUsers.map(user => ({
            name: user.name,
            email: user.email,
            plan: user.subscription?.plan || 'free',
            joinedAt: user.createdAt
          })),
          recentSubscriptions: recentSubscriptions.map(sub => ({
            userName: sub.userId?.name || '알 수 없음',
            plan: sub.plan,
            amount: sub.amount,
            status: sub.status,
            createdAt: sub.createdAt
          })),
          popularServices: popularServices.map(service => ({
            type: service._id,
            count: service.count
          }))
        }
      }
    });

  } catch (error) {
    console.error('통계 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '통계 데이터를 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    회원 목록 조회 (페이지네이션)
 * @route   GET /api/admin/users?page=1&limit=20&search=검색어
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // 검색 조건
    const searchQuery = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // 전체 회원 수
    const totalUsers = await User.countDocuments(searchQuery);

    // 회원 목록 조회
    const users = await User.find(searchQuery)
      .select('name email subscription.plan createdAt lastLogin isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.subscription?.plan || 'free',
          joinedAt: user.createdAt,
          lastLogin: user.lastLogin,
          status: user.isActive ? '활성' : '비활성'
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          limit
        }
      }
    });

  } catch (error) {
    console.error('회원 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '회원 목록을 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    회원 상세 정보 조회
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
exports.getUserDetail = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('subscription')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다.'
      });
    }

    // 회원의 사주 분석 내역
    const sajuHistory = await SajuAnalysis.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('analysisType createdAt');

    // 회원의 구독 내역
    const subscriptionHistory = await Subscription.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          subscription: user.subscription,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
          isActive: user.isActive
        },
        sajuHistory,
        subscriptionHistory
      }
    });

  } catch (error) {
    console.error('회원 상세 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '회원 정보를 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    회원 정보 수정
 * @route   PATCH /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'phone', 'isActive', 'subscription'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      message: '회원 정보가 수정되었습니다.',
      data: { user }
    });

  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    res.status(500).json({
      success: false,
      message: '회원 정보 수정에 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    회원 삭제 (소프트 삭제)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '회원을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      message: '회원이 비활성화되었습니다.'
    });

  } catch (error) {
    console.error('회원 삭제 실패:', error);
    res.status(500).json({
      success: false,
      message: '회원 삭제에 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    주문/결제 목록 조회
 * @route   GET /api/admin/orders?page=1&limit=20&status=전체
 * @access  Private/Admin
 */
exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status || '';
    const skip = (page - 1) * limit;

    // 상태 필터
    const statusQuery = status && status !== '전체' 
      ? { status } 
      : {};

    // 전체 주문 수
    const totalOrders = await Subscription.countDocuments(statusQuery);

    // 주문 목록 조회
    const orders = await Subscription.find(statusQuery)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        orders: orders.map(order => ({
          id: order._id,
          userName: order.userId?.name || '알 수 없음',
          userEmail: order.userId?.email || '-',
          plan: order.plan,
          amount: order.amount,
          finalAmount: order.finalAmount,
          status: order.status,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          startDate: order.startDate,
          endDate: order.endDate
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          limit
        }
      }
    });

  } catch (error) {
    console.error('주문 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '주문 목록을 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    주문 상세 정보 조회
 * @route   GET /api/admin/orders/:id
 * @access  Private/Admin
 */
exports.getOrderDetail = async (req, res) => {
  try {
    const order = await Subscription.findById(req.params.id)
      .populate('userId', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      data: { order }
    });

  } catch (error) {
    console.error('주문 상세 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '주문 정보를 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    주문 상태 변경
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const allowedStatuses = ['active', 'cancelled', 'expired', 'pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 상태입니다.'
      });
    }

    const order = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다.'
      });
    }

    res.status(200).json({
      success: true,
      message: '주문 상태가 변경되었습니다.',
      data: { order }
    });

  } catch (error) {
    console.error('주문 상태 변경 실패:', error);
    res.status(500).json({
      success: false,
      message: '주문 상태 변경에 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    서비스 목록 조회
 * @route   GET /api/admin/services
 * @access  Private/Admin
 */
exports.getServices = async (req, res) => {
  try {
    // 사주 분석 유형별 통계
    const sajuStats = await SajuAnalysis.aggregate([
      {
        $group: {
          _id: '$analysisType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // 구독 플랜별 통계
    const subscriptionStats = await Subscription.aggregate([
      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          revenue: { $sum: '$finalAmount' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        sajuServices: sajuStats.map(stat => ({
          type: stat._id,
          count: stat.count,
          label: getServiceLabel(stat._id)
        })),
        subscriptionPlans: subscriptionStats.map(stat => ({
          plan: stat._id,
          count: stat.count,
          revenue: stat.revenue,
          label: getPlanLabel(stat._id)
        }))
      }
    });

  } catch (error) {
    console.error('서비스 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '서비스 목록을 불러오는데 실패했습니다.',
      error: error.message
    });
  }
};

/**
 * @desc    서비스 정보 수정
 * @route   PATCH /api/admin/services/:id
 * @access  Private/Admin
 */
exports.updateService = async (req, res) => {
  try {
    // TODO: 서비스 모델이 생기면 구현
    res.status(200).json({
      success: true,
      message: '서비스 정보가 수정되었습니다.'
    });

  } catch (error) {
    console.error('서비스 정보 수정 실패:', error);
    res.status(500).json({
      success: false,
      message: '서비스 정보 수정에 실패했습니다.',
      error: error.message
    });
  }
};

// 헬퍼 함수
function getServiceLabel(type) {
  const labels = {
    'basic': '기본 사주',
    'detailed': '상세 사주',
    'premium': '프리미엄 종합 분석',
    'compatibility': '궁합',
    'yearly': '연운',
    'naming': '작명/개명'
  };
  return labels[type] || type;
}

function getPlanLabel(plan) {
  const labels = {
    'free': '무료',
    'monthly': '월간 플랜',
    'annual': '연간 플랜',
    'premium': '프리미엄'
  };
  return labels[plan] || plan;
}
