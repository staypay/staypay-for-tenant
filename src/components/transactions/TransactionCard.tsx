import React from "react";
import { ChevronRight } from "lucide-react";

export interface TransactionData {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  currency?: "KRW" | "KRWS";
  date?: string;
  status?: "pending" | "processing" | "completed" | "failed";
}

interface TransactionCardProps {
  transaction: TransactionData;
  onClick?: () => void;
  showDivider?: boolean;
  className?: string;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onClick,
  showDivider = true,
  className = "",
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR");
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      pending: { text: "송금 준비중", bg: "bg-status-pending" },
      processing: { text: "처리중", bg: "bg-status-pending" },
      completed: { text: "송금 완료", bg: "bg-status-complete" },
      failed: { text: "실패", bg: "bg-status-error" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <span
        className={`
        px-2 py-1 text-[9px] font-bold rounded
        ${config.bg} ${config.text}
      `}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className={`${className}`}>
      <div
        className={`
          flex items-center justify-between py-4
          ${onClick ? "cursor-pointer hover:bg-background-secondary/50" : ""}
        `}
        onClick={onClick}
      >
        <div className="flex-1">
          <h3 className="text-base font-bold text-text-secondary">
            {transaction.title}
          </h3>
          {transaction.subtitle && (
            <p className="text-sm font-bold text-text-muted mt-1">
              {transaction.subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-base font-semibold text-primary">
              {formatAmount(transaction.amount)}
            </p>
            <p className="text-xs font-semibold text-text-secondary">
              {transaction.currency || "KRWS"}
            </p>
          </div>

          {transaction.status && getStatusBadge(transaction.status)}

          {onClick && <ChevronRight className="w-5 h-5 text-text-muted" />}
        </div>
      </div>

      {showDivider && <div className="h-px bg-background-tertiary" />}
    </div>
  );
};

interface TransactionListProps {
  transactions: TransactionData[];
  onTransactionClick?: (transaction: TransactionData) => void;
  className?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onTransactionClick,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      {transactions.map((transaction, index) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => onTransactionClick?.(transaction)}
          showDivider={index < transactions.length - 1}
        />
      ))}
    </div>
  );
};
