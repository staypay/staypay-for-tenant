import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, BottomTabBar, TransactionList } from "@/components";
import { TransactionData } from "@/components/transactions/TransactionCard";
import {
  generateTransactions,
  apiSimulator,
  STORAGE_KEYS,
  localStorageHelper,
} from "@/lib/dummyData";
import { contractStorage } from "@/lib/contractStorage";
import { Filter, RefreshCw } from "lucide-react";
import { MobileContainer } from "@/components/layout/MobileContainer";

type FilterType = "all" | "pending" | "processing" | "completed" | "failed";

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab] = useState("history");
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    loadInitialTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter, transactions]);

  const loadInitialTransactions = async () => {
    setIsLoading(true);
    try {
      // Generate dummy data first (always show)
      const dummyTrans = generateTransactions(6);

      // Load contracts from localStorage
      const activeContracts = contractStorage.getActiveContracts();

      // Load saved transactions from localStorage
      const savedTransactions = localStorageHelper.load<TransactionData[]>(
        STORAGE_KEYS.TRANSACTIONS,
        []
      );

      // Combine dummy data with saved contract transactions
      let allTransactions: TransactionData[] = [];

      if (savedTransactions.length > 0) {
        // If we have saved transactions, combine with dummy data
        const contractTransactions = savedTransactions.filter((t) =>
          t.id.startsWith("trans-")
        );
        allTransactions = [...dummyTrans, ...contractTransactions];
      } else {
        // No saved transactions, just use dummy data
        allTransactions = [...dummyTrans];
      }

      // Sort by date (most recent first)
      allTransactions.sort((a, b) => {
        const dateA = new Date(a.date || "");
        const dateB = new Date(b.date || "");
        return dateB.getTime() - dateA.getTime();
      });

      // Limit to 6 most recent transactions
      setTransactions(allTransactions.slice(0, 6));

      setPage(1);
      setHasMore(false);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      const fallbackData = generateTransactions(3);
      setTransactions(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate refresh delay
      await loadInitialTransactions(); // Reload everything including contract data
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreTransactions = async () => {
    // Disabled for now - we're showing limited transactions
    return;
  };

  const applyFilter = () => {
    if (filter === "all") {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter((t) => t.status === filter);
      setFilteredTransactions(filtered);
    }
  };

  const handleTabClick = (tabId: string) => {
    if (tabId === "home") {
      navigate("/");
    } else if (tabId === "profile") {
      navigate("/profile");
    }
  };

  const handleTransactionClick = (transaction: TransactionData) => {
    // Disabled - no detail view needed
    return;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      loadMoreTransactions();
    }
  };

  const getFilterCount = (filterType: FilterType) => {
    if (filterType === "all") return transactions.length;
    return transactions.filter((t) => t.status === filterType).length;
  };

  const filterOptions: Array<{
    value: FilterType;
    label: string;
    color?: string;
  }> = [
    { value: "all", label: "전체" },
    { value: "pending", label: "송금 확인 중", color: "text-gray-300" },
    { value: "processing", label: "송금 완료", color: "text-primary" },
    { value: "completed", label: "상환 완료", color: "text-success" },
    { value: "failed", label: "실패", color: "text-danger" },
  ];

  // Group transactions by month
  const groupTransactionsByMonth = (transactions: TransactionData[]) => {
    const grouped: Record<string, TransactionData[]> = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date || transaction.subtitle || "");
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      grouped[monthKey].push(transaction);
    });

    return grouped;
  };

  const groupedTransactions = groupTransactionsByMonth(filteredTransactions);
  const sortedMonths = Object.keys(groupedTransactions).sort((a, b) =>
    b.localeCompare(a)
  );

  const formatMonthHeader = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-mobile mx-auto">
        <Header title="거래 내역" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
        <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
      </div>
    );
  }

  return (
    <MobileContainer>
      <Header
        title="거래 내역"
        rightContent={
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
          >
            <RefreshCw
              className={`w-5 h-5 text-text-primary ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
        }
      />

      {/* Filter Tabs */}
      <div className="bg-white border-b border-background-border">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap
                transition-colors flex items-center gap-1
                ${
                  filter === option.value
                    ? "bg-primary text-white"
                    : "bg-background-secondary text-text-secondary hover:bg-background-tertiary"
                }
              `}
            >
              <span className={filter !== option.value ? option.color : ""}>
                {option.label}
              </span>
              <span className="text-xs">({getFilterCount(option.value)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-auto pb-20" onScroll={handleScroll}>
        {isRefreshing && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary border-t-transparent" />
          </div>
        )}

        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Filter className="w-12 h-12 text-text-muted mb-4" />
            <p className="text-text-muted">거래 내역이 없습니다</p>
          </div>
        ) : (
          <div className="bg-white">
            {sortedMonths.map((monthKey) => (
              <div key={monthKey} className="mb-4">
                <div className="px-6 py-3 bg-background-secondary">
                  <h3 className="text-sm font-bold text-text-secondary">
                    {formatMonthHeader(monthKey)}
                  </h3>
                </div>
                <div className="px-6 pt-4">
                  <TransactionList
                    transactions={groupedTransactions[monthKey]}
                    onTransactionClick={handleTransactionClick}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredTransactions.length > 0 && (
          <div className="text-center py-4 text-sm text-text-muted">
            최근 거래 내역입니다
          </div>
        )}
      </div>

      <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
    </MobileContainer>
  );
};
