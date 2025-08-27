import { TransactionData } from "@/components/transactions/TransactionCard";

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
  verificationStatus: "verified" | "pending" | "unverified";
}

// Contract Data
export interface ContractData {
  id: string;
  name: string;
  tenantName: string;
  tenantPhone: string;
  landlordName: string;
  landlordPhone: string;
  propertyAddress: string;
  contractType: "월세" | "전세";
  deposit: number; // 보증금
  monthlyRent: number;
  managementFee: number;
  paymentDay: number;
  startDate: string;
  endDate: string;
  status: "active" | "expired" | "pending";
  createdAt: string;
  paymentHistory?: PaymentRecord[];
}

// Payment Record for tracking actual payments
export interface PaymentRecord {
  id: string;
  contractId: string;
  paymentDate: string;
  dueDate: string;
  amount: number;
  type: "rent" | "management" | "deposit";
  status: "pending" | "processing" | "completed" | "failed";
  transactionId?: string;
}

// Notification Data
export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: "payment" | "contract" | "system" | "promotion";
  isRead: boolean;
  createdAt: string;
}

// Generate random Korean names
const koreanFirstNames = [
  "김",
  "이",
  "박",
  "최",
  "정",
  "강",
  "조",
  "윤",
  "장",
  "임",
];
const koreanLastNames = [
  "민수",
  "지훈",
  "서연",
  "지우",
  "하은",
  "서준",
  "민지",
  "예준",
  "수빈",
  "지아",
];

const generateKoreanName = () => {
  const first =
    koreanFirstNames[Math.floor(Math.random() * koreanFirstNames.length)];
  const last =
    koreanLastNames[Math.floor(Math.random() * koreanLastNames.length)];
  return `${first}${last}`;
};

// Generate phone number
const generatePhoneNumber = () => {
  const middle = Math.floor(Math.random() * 9000) + 1000;
  const last = Math.floor(Math.random() * 9000) + 1000;
  return `010-${middle}-${last}`;
};

// Generate date - ensuring dates are after June 2025
const generateDate = (daysAgo: number = 0) => {
  const date = new Date("2025-07-01"); // Start from July 2025
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Dummy User Profile with realistic Korean credit score and loan amounts
export const dummyUserProfile: UserProfile = {
  id: "user-TEST-001",
  name: "테스트사용자",
  phone: "010-0000-0000",
  email: "test.user@example.com",
  joinDate: "2024-01-15",
  creditScore: 720, // Korean credit score range: 1-1000, 664+ is good
  totalLoans: 24000000, // Total loans: 24 million KRW
  currentLoan: 4800000, // Current loan: 4.8 million KRW (2 months prepaid)
  loanLimit: 10000000, // Loan limit: 10 million KRW
  verificationStatus: "verified",
};

// Generate Transaction Data
export const generateTransactions = (count: number = 10): TransactionData[] => {
  const statuses: Array<"pending" | "processing" | "completed" | "failed"> = [
    "completed",
    "completed",
    "completed",
    "pending",
    "processing",
  ];

  // Reduced amounts to stay within 2M KRW loan limit - TEST DATA
  const propertyTypes = [
    { name: "테스트 원룸A", rent: 500000, management: 80000 }, // 580,000
    { name: "테스트 원룸B", rent: 450000, management: 70000 }, // 520,000
    { name: "테스트 원룸C", rent: 400000, management: 60000 }, // 460,000
    { name: "테스트 원룸D", rent: 350000, management: 50000 }, // 400,000
    { name: "테스트 원룸E", rent: 380000, management: 55000 }, // 435,000
  ];
  const transactions: TransactionData[] = [];

  for (let i = 0; i < count; i++) {
    const daysAgo = i * 30; // Each transaction is 30 days apart
    // First one pending, second processing, rest completed
    const status = i === 0 ? "pending" : i === 1 ? "processing" : "completed";
    const property = propertyTypes[i % propertyTypes.length];

    const transDate = new Date("2025-07-01");
    transDate.setDate(transDate.getDate() - daysAgo);
    const dueDate = new Date(transDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    transactions.push({
      id: `dummy-trans-${String(i + 1).padStart(3, "0")}`,
      title: `${property.name} 월세,관리비`,
      subtitle: `${transDate.toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")}`,
      amount: property.rent + property.management,
      currency: "KRWS",
      date: transDate.toISOString().split("T")[0],
      status,
      dueDate: `${dueDate.toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")}`,
      transferAmount: property.rent,
      fee: 10000,
      landlordAccount: "테스트은행_TEST123456_테스트임대인",
      senderName: "테스트사용자",
      ...(status === "completed" && {
        transferTime: `${transDate.toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")} 14:30:00`,
        repaymentTime: `${new Date("2025-08-01").toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")} 09:15:00`,
      }),
    });
  }

  return transactions;
};

// Generate Contract Data - TEST DATA
export const generateContracts = (count: number = 5): ContractData[] => {
  const contracts: ContractData[] = [];
  const propertyTypes = [
    {
      name: "테스트 오피스텔A",
      address: "서울특별시 테스트구 테스트로 123",
      type: "월세" as const,
      deposit: 10000000, // 10M KRW deposit
      rent: 500000, // 500K monthly (reduced for loan limit)
      management: 80000,
    },
    {
      name: "테스트 아파트B",
      address: "서울특별시 테스트구 테스트로 456",
      type: "월세" as const,
      deposit: 15000000, // 15M deposit
      rent: 450000, // 450K monthly
      management: 70000,
    },
    {
      name: "테스트 빌라C",
      address: "서울특별시 테스트구 테스트로 789",
      type: "월세" as const,
      deposit: 8000000, // 8M deposit
      rent: 400000, // 400K monthly
      management: 60000,
    },
    {
      name: "테스트 원룸D",
      address: "서울특별시 테스트구 테스트로 101",
      type: "월세" as const,
      deposit: 5000000, // 5M deposit
      rent: 350000, // 350K monthly
      management: 50000,
    },
    {
      name: "테스트 투룸E",
      address: "서울특별시 테스트구 테스트로 202",
      type: "월세" as const,
      deposit: 12000000, // 12M deposit
      rent: 380000, // 380K monthly
      management: 55000,
    },
  ];

  for (let i = 0; i < count; i++) {
    const property = propertyTypes[i % propertyTypes.length];
    const startDaysAgo = i * 365; // Each contract is 1 year apart
    const contractId = `contract-${String(i + 1).padStart(3, "0")}`;

    // Generate payment history for active contracts
    const paymentHistory: PaymentRecord[] = [];
    if (i === 0) {
      // Active contract - generate 3 months of payment history
      for (let month = 0; month < 3; month++) {
        paymentHistory.push({
          id: `payment-${contractId}-${month + 1}`,
          contractId: contractId,
          paymentDate: generateDate(month * 30),
          dueDate: generateDate(month * 30 + 5),
          amount: property.rent + property.management,
          type: "rent",
          status: "completed",
          transactionId: `trans-${String(month + 1).padStart(3, "0")}`,
        });
      }
    }

    contracts.push({
      id: contractId,
      name: `${property.name} ${property.type}계약`,
      tenantName: generateKoreanName(),
      tenantPhone: generatePhoneNumber(),
      landlordName: generateKoreanName(),
      landlordPhone: generatePhoneNumber(),
      propertyAddress: property.address,
      contractType: property.type,
      deposit: property.deposit,
      monthlyRent: property.rent,
      managementFee: property.management,
      paymentDay: 5, // Common payment day in Korea
      startDate: generateDate(startDaysAgo),
      endDate: generateDate(startDaysAgo - 365),
      status: i === 0 ? "active" : i === 1 ? "pending" : "expired",
      createdAt: generateDate(startDaysAgo),
      paymentHistory: paymentHistory,
    });
  }

  return contracts;
};

// Generate Notifications
export const generateNotifications = (): NotificationData[] => {
  return [
    {
      id: "notif-001",
      title: "월세 납부 완료",
      message: "강남구 오피스텔 월세 1,350,000원이 성공적으로 납부되었습니다.",
      type: "payment",
      isRead: false,
      createdAt: generateDate(1),
    },
    {
      id: "notif-002",
      title: "계약서 등록 완료",
      message: "새로운 월세 계약이 등록되었습니다.",
      type: "contract",
      isRead: false,
      createdAt: generateDate(2),
    },
    {
      id: "notif-003",
      title: "납부일 알림",
      message: "내일은 월세 납부일입니다. 잊지 마세요!",
      type: "payment",
      isRead: true,
      createdAt: generateDate(3),
    },
    {
      id: "notif-004",
      title: "신규 혜택 안내",
      message: "이번 달 StayPay 이용 고객님께 특별 혜택을 드립니다.",
      type: "promotion",
      isRead: true,
      createdAt: generateDate(5),
    },
    {
      id: "notif-005",
      title: "시스템 점검 안내",
      message: "오늘 오후 2시부터 10분간 시스템 점검이 있을 예정입니다.",
      type: "system",
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
  fetchTransactions: (
    page: number = 1,
    limit: number = 10
  ): Promise<TransactionData[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 5% network error
        if (Math.random() < 0.05) {
          reject(new Error("네트워크 오류가 발생했습니다."));
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
  submitContract: (
    data: any
  ): Promise<{ success: boolean; contractId: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 10% failure rate
        if (Math.random() < 0.1) {
          reject(new Error("계약 등록에 실패했습니다. 다시 시도해주세요."));
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
      console.error("Failed to save to localStorage:", error);
      return false;
    }
  },

  // Load data from localStorage
  load: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
      return defaultValue;
    }
  },

  // Remove data from localStorage
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Failed to remove from localStorage:", error);
      return false;
    }
  },
};

// Storage keys
export const STORAGE_KEYS = {
  USER_PROFILE: "staypay_user_profile",
  TRANSACTIONS: "staypay_transactions",
  CONTRACTS: "staypay_contracts",
  NOTIFICATIONS: "staypay_notifications",
  SETTINGS: "staypay_settings",
};
