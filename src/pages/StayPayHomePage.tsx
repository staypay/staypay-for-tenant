import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header,
  BottomTabBar,
  ToggleButtonGroup,
  LoanSummary,
  QuickActionCard,
  LinkButton,
  SectionTitle,
} from "../components";
import { TransactionData } from "@/components/transactions/TransactionCard";
import { SimpleTransactionList } from "@/components/transactions/SimpleTransactionCard";
import { MobileContainer } from "@/components/layout/MobileContainer";
import { contractStorage } from "@/lib/contractStorage";
import { localStorageHelper, STORAGE_KEYS, generateTransactions } from "@/lib/dummyData";

interface StayPayHomePageProps {
  onNavigate?: (page: string) => void;
}

export const StayPayHomePage: React.FC<StayPayHomePageProps> = ({
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [userMode, setUserMode] = useState<"borrower" | "lender">("borrower");
  const [activeTab, setActiveTab] = useState("home");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loanAmount, setLoanAmount] = useState(0);
  const [hasActiveContracts, setHasActiveContracts] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load contracts from LocalStorage
    const activeContracts = contractStorage.getActiveContracts();
    setHasActiveContracts(activeContracts.length > 0);
    
    // Generate dummy data first
    const dummyTrans = generateTransactions(3);
    
    // Load transactions from localStorage
    const savedTransactions = localStorageHelper.load<TransactionData[]>(
      STORAGE_KEYS.TRANSACTIONS,
      []
    );
    
    // If we have saved transactions, use them combined with dummy data
    if (savedTransactions.length > 0) {
      // Filter out duplicate dummy transactions and combine
      const contractTransactions = savedTransactions.filter(t => t.id.startsWith('trans-'));
      const allTransactions = [...dummyTrans, ...contractTransactions];
      
      // Sort by date (most recent first)
      allTransactions.sort((a, b) => {
        const dateA = new Date(a.date || '');
        const dateB = new Date(b.date || '');
        return dateB.getTime() - dateA.getTime();
      });
      
      // Calculate loan amount
      let totalLoan = 0;
      allTransactions.forEach(transaction => {
        if (transaction.status === 'pending' || transaction.status === 'processing') {
          totalLoan += transaction.amount;
        }
      });
      setLoanAmount(Math.min(totalLoan, 2000000));
      
      setTransactions(allTransactions.slice(0, 3));
    } else {
      // No saved transactions, just use dummy data
      setTransactions(dummyTrans.slice(0, 3));
      
      // Calculate loan from dummy data
      let totalLoan = 0;
      dummyTrans.forEach(transaction => {
        if (transaction.status === 'pending' || transaction.status === 'processing') {
          totalLoan += transaction.amount;
        }
      });
      setLoanAmount(Math.min(totalLoan, 2000000));
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "history") {
      navigate("/history");
    } else if (tabId === "home") {
      navigate("/");
    } else if (tabId === "profile") {
      navigate("/profile");
    }
  };

  const handleTransactionClick = (transaction: any) => {
    navigate(`/transaction/${transaction.id}`);
  };

  const handleSeeAllClick = () => {
    navigate("/history");
  };

  const handleQuickActionClick = () => {
    navigate("/prepay");
  };

  return (
    <MobileContainer>
      {/* 상단 헤더 영역 */}
      <div className="bg-white border-b border-background-border">
        <div className="h-10 bg-white" />
        <div className="h-14 flex items-center justify-center">
          <h1 className="text-lg font-medium text-primary">StayPay</h1>
        </div>
        <div className="px-4 pb-3">
          {/* 빌리기/빌려주기 토글 */}
          <div className="flex justify-center">
            <ToggleButtonGroup
              options={[
                { value: "borrower", label: "빌리기" },
                { value: "lender", label: "빌려주기" },
              ]}
              value={userMode}
              onChange={(value) => setUserMode(value as "borrower" | "lender")}
            />
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 px-6 py-6 pb-20 overflow-auto">
        {/* 대출 정보 섹션 */}
        <div className="mb-8">
          <LoanSummary
            loanLimit={2000000}
            currentLoan={Math.min(loanAmount, 2000000)}
            dueDate="2025-09-01"
          />
        </div>

        {/* 월세 선납하기 버튼 */}
        <div className="mb-8">
          <QuickActionCard
            label="월세 선납하기"
            onClick={handleQuickActionClick}
          />
        </div>

        {/* 계약 히스토리 섹션 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary">
              계약 히스토리
            </h2>
            {transactions.length > 0 && (
              <LinkButton
                label="See all"
                onClick={handleSeeAllClick}
                showIcon={true}
              />
            )}
          </div>

          {/* 거래 내역 리스트 - 간단한 버전 */}
          {transactions.length > 0 ? (
            <SimpleTransactionList
              transactions={transactions}
              onTransactionClick={undefined} // Remove click handler
            />
          ) : (
            <div className="text-center py-8 text-text-muted">
              {hasActiveContracts 
                ? "아직 거래 내역이 없습니다." 
                : "계약을 등록하고 월세를 선납해보세요!"}
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
    </MobileContainer>
  );
};
