import React from 'react';

interface ContractDetails {
  id: string;
  propertyName: string;
  type: 'deposit' | 'monthly';
  amount: number;
  fee?: number;
  landlordAccount?: {
    bank: string;
    number: string;
    name: string;
  };
  tenantName?: string;
  paymentAmount?: number;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  paymentDate?: string;
  repaymentDate?: string;
  status?: 'active' | 'completed';
}

interface ContractCardProps {
  contract: ContractDetails;
  variant?: 'summary' | 'detailed';
  showActions?: boolean;
  onAction?: (action: 'view' | 'verify') => void;
  className?: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({
  contract,
  variant = 'summary',
  showActions = false,
  onAction,
  className = '',
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ko-KR');
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return date.replace(/-/g, '/').substring(2);
  };

  if (variant === 'summary') {
    return (
      <div className={`bg-background-secondary border border-text-light rounded-md p-4 ${className}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-base font-bold text-text-secondary">
              {contract.propertyName}
            </h3>
            <p className="text-xs font-bold text-text-muted mt-1">
              {formatDate(contract.startDate)} 생성
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-primary">
              {formatAmount(contract.amount)}
            </p>
            <p className="text-xs font-semibold text-text-secondary">
              KRWS
            </p>
          </div>
        </div>

        {showActions && (
          <button
            onClick={() => onAction?.('verify')}
            className="mt-3 px-3 py-1.5 text-[10px] font-bold text-white bg-primary/50 rounded"
          >
            KaiaScan에서 확인
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-background-secondary border border-text-light rounded-md ${className}`}>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-base font-bold text-text-secondary">
              {contract.type === 'deposit' ? contract.propertyName : '월세,관리비'}
            </h3>
            <p className="text-xs font-bold text-text-muted mt-1">
              {formatDate(contract.startDate)} 생성
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-primary">
              {formatAmount(contract.amount)}
            </p>
            <p className="text-xs font-semibold text-text-secondary">
              KRWS
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {contract.dueDate && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">만기</span>
              <span className="font-medium text-text-secondary">
                {formatDate(contract.dueDate)}
              </span>
            </div>
          )}

          {contract.fee !== undefined && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">수수료</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-secondary">
                  {formatAmount(contract.fee)}
                </span>
                <span className="font-semibold text-text-secondary">
                  KRWS
                </span>
              </div>
            </div>
          )}

          {contract.landlordAccount && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">임대인 계좌 정보</span>
              <span className="text-text-secondary">
                {contract.landlordAccount.bank},{contract.landlordAccount.number},{contract.landlordAccount.name}
              </span>
            </div>
          )}

          {contract.tenantName && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">보낸 이름</span>
              <span className="text-text-secondary">
                {contract.tenantName}
              </span>
            </div>
          )}

          {contract.paymentAmount && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">송금액</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-secondary">
                  {formatAmount(contract.paymentAmount)}
                </span>
                <span className="font-semibold text-text-secondary">
                  KRWS
                </span>
              </div>
            </div>
          )}

          {contract.paymentDate && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">임대료 송금시간</span>
              <span className="font-medium text-text-primary">
                {contract.paymentDate}
              </span>
            </div>
          )}

          {contract.repaymentDate && (
            <div className="flex justify-between text-xs">
              <span className="font-medium text-text-primary">상환일시</span>
              <span className="font-medium text-danger">
                {contract.repaymentDate}
              </span>
            </div>
          )}
        </div>

        {contract.status === 'completed' && (
          <div className="flex justify-end pt-2">
            <span className="px-3 py-1 text-[10px] font-bold text-white bg-success rounded">
              상환완료
            </span>
          </div>
        )}

        {showActions && (
          <button
            onClick={() => onAction?.('verify')}
            className="mt-2 px-3 py-1.5 text-[10px] font-bold text-white bg-primary/50 rounded"
          >
            KaiaScan에서 확인
          </button>
        )}
      </div>
    </div>
  );
};