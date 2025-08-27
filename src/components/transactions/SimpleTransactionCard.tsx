import React from "react";
import { TransactionData } from "./TransactionCard";

interface SimpleTransactionCardProps {
  transaction: TransactionData;
  onClick?: () => void;
  showDivider?: boolean;
  className?: string;
}

export const SimpleTransactionCard: React.FC<SimpleTransactionCardProps> = ({
  transaction,
  onClick,
  showDivider = true,
  className = "",
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR");
  };

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        text: "송금 준비중",
        bg: "bg-text-secondary",
        textColor: "text-white",
      },
      processing: {
        text: "송금 완료",
        bg: "bg-primary",
        textColor: "text-white",
      },
      completed: {
        text: "상환 완료",
        bg: "bg-success",
        textColor: "text-white",
      },
      failed: {
        text: "실패",
        bg: "bg-red-500",
        textColor: "text-white",
      },
    };

    const config =
      statusConfig[transaction.status as keyof typeof statusConfig] ||
      statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center justify-center px-2 py-0.5 rounded text-[9px] font-bold min-w-[56px] ${config.bg} ${config.textColor}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <>
      <div
        className={`flex items-center justify-between py-3 ${className}`}
        onClick={onClick}
      >
        {/* Left side - Title and Date */}
        <div className="flex-1">
          <h3 className="text-base font-bold text-text-secondary">
            {transaction.title}
          </h3>
          <p className="text-sm font-bold text-text-muted mt-1">
            {transaction.subtitle || transaction.date}
          </p>
        </div>

        {/* Right side - Amount and Status */}
        <div className="text-right">
          <div className="flex items-baseline justify-end">
            <span className="text-base font-semibold text-text-primary">
              {formatAmount(transaction.amount)}
            </span>
            <span className="text-xs font-semibold text-text-primary ml-2">
              {transaction.currency || "KRWS"}
            </span>
          </div>
          {/* Status Badge below amount */}
          {transaction.status && (
            <div className="mt-1 flex justify-end">{getStatusBadge()}</div>
          )}
        </div>
      </div>
      {showDivider && <div className="border-b border-background-tertiary" />}
    </>
  );
};

interface SimpleTransactionListProps {
  transactions: TransactionData[];
  onTransactionClick?: (transaction: TransactionData) => void;
  className?: string;
}

export const SimpleTransactionList: React.FC<SimpleTransactionListProps> = ({
  transactions,
  onTransactionClick,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      {transactions.map((transaction, index) => (
        <SimpleTransactionCard
          key={transaction.id}
          transaction={transaction}
          onClick={() => onTransactionClick?.(transaction)}
          showDivider={index < transactions.length - 1}
        />
      ))}
    </div>
  );
};
