import { TransactionData } from '@/components/transactions/TransactionCard';

// User Profile Data
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  joinDate: string;
  creditScore: number;
  totalLoans: number;
  currentLoan: number;
  loanLimit: number;
  verificationStatus: 'verified' | 'pending' | 'unverified';
}

// Contract Data
export interface ContractData {
  id: string;
  name: string;
  tenantName: string;
  tenantPhone: string;
  landlordName: string;
  landlordPhone: string;
  monthlyRent: number;
  managementFee: number;
  paymentDay: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  createdAt: string;
}

// Notification Data
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: 'payment' | 'contract' | 'system' | 'promotion';
  isRead: boolean;
  createdAt: string;
}

// Generate random Korean names
const koreanFirstNames = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임'];
const koreanLastNames = ['민수', '지훈', '서연', '지우', '하은', '서준', '민지', '예준', '수빈', '지아'];

const generateKoreanName = () => {
  const first = koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
  const last = koreanLastNames[Math.floor(Math.random() * koreanLastNames.length)];
  return `${first}${last}`;
};

// Generate phone number
const generatePhoneNumber = () => {
  const middle = Math.floor(Math.random() * 9000) + 1000;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `010-${middle}-${last}`;
};

// Generate date
const generateDate = (daysAgo: number = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Dummy User Profile
export const dummyUserProfile: UserProfile = {
  id: 'user-001',
  name: '김민수',
  phone: '010-1234-5678',
  email: 'minsoo.kim@example.com',
  joinDate: '2024-01-15',
  creditScore: 750,
  totalLoans: 5200000,
  currentLoan: 1040000,
  loanLimit: 2000000,
  verificationStatus: 'verified',
};

// Generate Transaction Data
export const generateTransactions = (count: number = 20): TransactionData[] => {
  const statuses: Array<'pending' | 'processing' | 'completed' | 'failed'> = [
    'completed', 'completed', 'completed', 'pending', 'processing'
  ];
  
  const propertyNames = ['A빌라', 'B아파트', 'C오피스텔', 'D빌라', 'E하우스'];
  const transactions: TransactionData[] = [];
  
  for (let i = 0; i < count; i++) {
    const daysAgo = i * 30; // Each transaction is 30 days apart
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const property = propertyNames[Math.floor(Math.random() * propertyNames.length)];
    
    transactions.push({
      id: `trans-${String(i + 1).padStart(3, '0')}`,
      title: i % 3 === 0 ? `${property} 보증금` : '월세,관리비',
      subtitle: generateDate(daysAgo),
      amount: 500000 + Math.floor(Math.random() * 200000),
      currency: 'KRWS',
      date: generateDate(daysAgo),
      status,
    });
  }
  
  return transactions;
};

// Generate Contract Data
export const generateContracts = (count: number = 5): ContractData[] => {
  const contracts: ContractData[] = [];
  
  for (let i = 0; i < count; i++) {
    const startDaysAgo = i * 365; // Each contract is 1 year apart
    contracts.push({
      id: `contract-${String(i + 1).padStart(3, '0')}`,
      name: `${['A빌라', 'B아파트', 'C오피스텔'][i % 3]} 월세계약`,
      tenantName: generateKoreanName(),
      tenantPhone: generatePhoneNumber(),
      landlordName: generateKoreanName(),
      landlordPhone: generatePhoneNumber(),
      monthlyRent: 500000 + Math.floor(Math.random() * 500000),
      managementFee: 50000 + Math.floor(Math.random() * 100000),
      paymentDay: Math.floor(Math.random() * 28) + 1,
      startDate: generateDate(startDaysAgo),
      endDate: generateDate(startDaysAgo - 365),
      status: i === 0 ? 'active' : i === 1 ? 'pending' : 'expired',
      createdAt: generateDate(startDaysAgo),
    });
  }
  
  return contracts;
};

// Generate Notifications
export const generateNotifications = (): NotificationData[] => {
  return [
    {
      id: 'notif-001',
      title: '월세 납부 완료',
      message: 'A빌라 월세 510,000 KRWS가 성공적으로 납부되었습니다.',
      type: 'payment',
      isRead: false,
      createdAt: generateDate(1),
    },
    {
      id: 'notif-002',
      title: '계약서 등록 완료',
      message: '새로운 월세 계약이 등록되었습니다.',
      type: 'contract',
      isRead: false,
      createdAt: generateDate(2),
    },
    {
      id: 'notif-003',
      title: '납부일 알림',
      message: '내일은 월세 납부일입니다. 잊지 마세요!',
      type: 'payment',
      isRead: true,
      createdAt: generateDate(3),
    },
    {
      id: 'notif-004',
      title: '신규 혜택 안내',
      message: '이번 달 StayPay 이용 고객님께 특별 혜택을 드립니다.',
      type: 'promotion',
      isRead: true,
      createdAt: generateDate(5),
    },
    {
      id: 'notif-005',
      title: '시스템 점검 안내',
      message: '오늘 오후 2시부터 10분간 시스템 점검이 있을 예정입니다.',
      type: 'system',
      isRead: true,
      createdAt: generateDate(7),
    },
  ];
};

// API Simulation Functions with Fake Delays
export const apiSimulator = {
  // Fetch user profile with 1 second delay
  fetchUserProfile: (): Promise<UserProfile> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dummyUserProfile);
      }, 1000);
    });
  },
  
  // Fetch transactions with 2 second delay
  fetchTransactions: (page: number = 1, limit: number = 10): Promise<TransactionData[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 5% network error
        if (Math.random() < 0.05) {
          reject(new Error('네트워크 오류가 발생했습니다.'));
        } else {
          const allTransactions = generateTransactions(50);
          const start = (page - 1) * limit;
          const end = start + limit;
          resolve(allTransactions.slice(start, end));
        }
      }, 2000);
    });
  },
  
  // Submit contract with 3 second delay
  submitContract: (data: any): Promise<{ success: boolean; contractId: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% failure rate
        if (Math.random() < 0.1) {
          reject(new Error('계약 등록에 실패했습니다. 다시 시도해주세요.'));
        } else {
          resolve({
            success: true,
            contractId: `contract-${Date.now()}`,
          });
        }
      }, 3000);
    });
  },
  
  // Fetch contract details
  fetchContractDetails: (id: string): Promise<ContractData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const contracts = generateContracts(5);
        resolve(contracts[0]);
      }, 1500);
    });
  },
  
  // Fetch notifications
  fetchNotifications: (): Promise<NotificationData[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(generateNotifications());
      }, 800);
    });
  },
};

// LocalStorage Helper Functions
export const localStorageHelper = {
  // Save data to localStorage
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  },
  
  // Load data from localStorage
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  },
  
  // Remove data from localStorage
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'staypay_user_profile',
  TRANSACTIONS: 'staypay_transactions',
  CONTRACTS: 'staypay_contracts',
  NOTIFICATIONS: 'staypay_notifications',
  SETTINGS: 'staypay_settings',
};