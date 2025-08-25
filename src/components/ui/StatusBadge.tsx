import React from "react";

export type StatusType =
  | "pending"
  | "processing"
  | "completed"
  | "success"
  | "error"
  | "warning";

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  size = "md",
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          text: text || "송금 준비중",
          bg: "bg-status-pending",
          textColor: "text-white",
        };
      case "processing":
        return {
          text: text || "처리중",
          bg: "bg-primary",
          textColor: "text-white",
        };
      case "completed":
        return {
          text: text || "송금 완료",
          bg: "bg-primary",
          textColor: "text-white",
        };
      case "success":
        return {
          text: text || "상환완료",
          bg: "bg-success",
          textColor: "text-white",
        };
      case "error":
        return {
          text: text || "실패",
          bg: "bg-danger",
          textColor: "text-white",
        };
      case "warning":
        return {
          text: text || "경고",
          bg: "bg-warning",
          textColor: "text-white",
        };
      default:
        return {
          text: text || "",
          bg: "bg-gray",
          textColor: "text-white",
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-[9px]";
      case "md":
        return "px-3 py-1 text-[10px]";
      case "lg":
        return "px-4 py-1.5 text-xs";
      default:
        return "px-3 py-1 text-[10px]";
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`
      inline-flex items-center justify-center
      font-bold rounded
      ${config.bg} ${config.textColor}
      ${getSizeClasses()}
      ${className}
    `}
    >
      {config.text}
    </span>
  );
};

interface TransactionStatusProps {
  amount: number;
  status?: StatusType;
  date?: string;
  currency?: "KRW" | "KRWS";
  showStatus?: boolean;
  className?: string;
}

export const TransactionStatus: React.FC<TransactionStatusProps> = ({
  amount,
  status,
  date,
  currency = "KRWS",
  showStatus = true,
  className = "",
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR");
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {date && <p className="text-sm font-bold text-text-muted">{date}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-base font-semibold text-primary">
            {formatAmount(amount)}
          </p>
          <p className="text-xs font-semibold text-text-secondary">
            {currency}
          </p>
        </div>

        {showStatus && status && <StatusBadge status={status} />}
      </div>
    </div>
  );
};
