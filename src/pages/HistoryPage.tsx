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
      // Check localStorage first
      const savedTransactions = localStorageHelper.load<TransactionData[]>(
        STORAGE_KEYS.TRANSACTIONS,
        []
      );

      if (savedTransactions.length > 0) {
        setTransactions(savedTransactions);
      } else {
        // Generate and save dummy data
        const data = await apiSimulator.fetchTransactions(1, 20);
        setTransactions(data);
        localStorageHelper.save(STORAGE_KEYS.TRANSACTIONS, data);
      }
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      // Use fallback data
      const fallbackData = generateTransactions(20);
      setTransactions(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate refresh delay
      const data = await apiSimulator.fetchTransactions(1, 20);
      setTransactions(data);
      localStorageHelper.save(STORAGE_KEYS.TRANSACTIONS, data);
      setPage(1);
      setHasMore(true);
    } catch (error) {
      console.error("Failed to refresh:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const loadMoreTransactions = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const newTransactions = await apiSimulator.fetchTransactions(
        nextPage,
        10
      );

      if (newTransactions.length === 0) {
        setHasMore(false);
      } else {
        const updatedTransactions = [...transactions, ...newTransactions];
        setTransactions(updatedTransactions);
        localStorageHelper.save(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setIsLoadingMore(false);
    }
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
    navigate(`/transaction/${transaction.id}`);
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
    { value: "pending", label: "대기중", color: "text-warning" },
    { value: "processing", label: "처리중", color: "text-primary" },
    { value: "completed", label: "완료", color: "text-success" },
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
              <div key={monthKey} className="mb-2">
                <div className="px-6 py-3 bg-background-secondary">
                  <h3 className="text-sm font-bold text-text-secondary">
                    {formatMonthHeader(monthKey)}
                  </h3>
                </div>
                <div className="px-6">
                  <TransactionList
                    transactions={groupedTransactions[monthKey]}
                    onTransactionClick={handleTransactionClick}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary border-t-transparent" />
          </div>
        )}

        {!hasMore && filteredTransactions.length > 0 && (
          <div className="text-center py-4 text-sm text-text-muted">
            모든 거래 내역을 불러왔습니다
          </div>
        )}
      </div>

      <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
    </MobileContainer>
  );
};
