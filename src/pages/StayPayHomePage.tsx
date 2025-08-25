import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Header,
  BottomTabBar,
  ToggleButtonGroup,
  LoanSummary,
  QuickActionCard,
  TransactionList,
  LinkButton,
  SectionTitle,
} from "../components";
import { TransactionData } from "@/components/transactions/TransactionCard";
import { MobileContainer } from "@/components/layout/MobileContainer";

interface StayPayHomePageProps {
  onNavigate?: (page: string) => void;
}

export const StayPayHomePage: React.FC<StayPayHomePageProps> = ({
  onNavigate,
}) => {
  const navigate = useNavigate();
  const [userMode, setUserMode] = useState<"borrower" | "lender">("borrower");
  const [activeTab, setActiveTab] = useState("home");

  // 더미 데이터
  const dummyTransactions = [
    {
      id: "1",
      title: "A빌라 월세보증금",
      subtitle: "25/09/01",
      amount: 510000,
      currency: "KRWS" as const,
      status: "pending" as const, // 송금 준비중
    },
    {
      id: "2",
      title: "월세,관리비",
      subtitle: "25/08/01",
      amount: 510000,
      currency: "KRWS" as const,
      status: "completed" as const, // 송금 완료
    },
    {
      id: "3",
      title: "월세,관리비",
      subtitle: "25/08/01",
      amount: 510000,
      currency: "KRWS" as const,
      status: "completed" as const, // 상환완료
    },
  ] as TransactionData[];

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
            currentLoan={1040000}
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
            <LinkButton
              label="See all"
              onClick={handleSeeAllClick}
              showIcon={true}
            />
          </div>

          {/* 거래 내역 리스트 */}
          <TransactionList
            transactions={dummyTransactions}
            onTransactionClick={handleTransactionClick}
          />
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
    </MobileContainer>
  );
};
