import React from "react";

export interface TransactionData {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  currency?: "KRW" | "KRWS";
  date?: string;
  status?: "pending" | "processing" | "completed" | "failed";
  // Additional fields for new UI
  dueDate?: string; // 만기
  transferAmount?: number; // 송금액
  fee?: number; // 수수료
  landlordAccount?: string; // 임대인 계좌 정보
  senderName?: string; // 보낸 이름
  transferTime?: string; // 임대료 송금시간
  repaymentTime?: string; // 상환일시
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

  const getStatusBadge = () => {
    const statusConfig = {
      pending: {
        text: "송금 확인 중",
        bg: "bg-text-secondary",
        textColor: "text-white",
      },
      processing: {
        text: "송금 완료",
        bg: "bg-blue-500",
        textColor: "text-white",
      },
      completed: {
        text: "상환 완료",
        bg: "bg-green-500",
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
        className={`
          inline-flex items-center justify-center
          px-3 py-1.5 text-xs font-bold rounded-md min-w-[80px]
          ${config.bg} ${config.textColor}
        `}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div
      className={`bg-background-secondary rounded-md border border-background-border p-4 mb-3 ${className}`}
    >
      {/* Top Section: Title, Date, Amount */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-base font-bold text-text-primary">
            {transaction.title}
          </h3>
          <p className="text-xs font-bold text-text-muted mt-1">
            {transaction.subtitle || `${transaction.date}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold text-primary">
            {formatAmount(transaction.amount)}
          </p>
          <p className="text-xs font-semibold text-text-primary mt-1">
            {transaction.currency || "KRWS"}
          </p>
        </div>
      </div>

      {/* Middle Section: Transaction Details */}
      <div className="space-y-2 text-xs">
        {/* Row 1: 만기 and 송금액 */}
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="text-text-primary font-medium w-20">만기</span>
            <span className="text-text-secondary ml-auto">
              {transaction.dueDate || "25/10/01"}
            </span>
          </div>
        </div>

        {/* Row 2: 송금액 */}
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="text-text-primary font-medium w-20">송금액</span>
            <span className="text-text-secondary ml-auto">
              {formatAmount(transaction.transferAmount || transaction.amount)}{" "}
              KRWS
            </span>
          </div>
        </div>

        {/* Row 2: 수수료 */}
        <div className="flex justify-between">
          <div className="flex items-center">
            <span className="text-text-primary font-medium w-20">수수료</span>
            <span className="text-text-secondary ml-auto">
              {formatAmount(transaction.fee || 10000)} KRWS
            </span>
          </div>
        </div>

        {/* Row 3: 임대인 계좌 정보 */}
        <div className="flex items-center">
          <span className="text-text-primary font-medium w-20">
            임대인 계좌 정보
          </span>
          <span className="text-text-secondary text-xs ml-2">
            {transaction.landlordAccount || "국민은행_12345678_장훈"}
          </span>
        </div>

        {/* Row 4: 보낸 이름 */}
        <div className="flex items-center">
          <span className="text-text-primary font-medium w-20">보낸 이름</span>
          <span className="text-text-secondary ml-auto">
            {transaction.senderName || "송승재"}
          </span>
        </div>

        {/* Additional info for completed status */}
        {transaction.status === "completed" && (
          <>
            <div className="flex items-center">
              <span className="text-text-primary font-medium w-20">
                임대료 송금시간
              </span>
              <span className="text-text-secondary ml-auto">
                {transaction.transferTime || "25/07/01 22:04:02"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-text-primary font-medium w-20">
                상환일시
              </span>
              <span className="text-danger ml-auto">
                {transaction.repaymentTime || "25/08/01 15:04:02"}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Bottom Section: Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Open KaiaScan
            window.open("https://kaiascan.io", "_blank");
          }}
          className="px-3 py-1.5 text-[10px] font-bold text-white bg-primary/50 rounded"
        >
          KaiaScan에서 확인
        </button>
        {getStatusBadge()}
      </div>
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
