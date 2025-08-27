import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { PrimaryButton } from "@/components";
import { StoredContract } from "@/lib/contractStorage";

interface CompletionStepProps {
  onComplete: () => void;
  contractData?: StoredContract | null;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  onComplete,
  contractData,
}) => {
  const navigate = useNavigate();

  const handleViewContract = () => {
    if (contractData) {
      // Navigate to transaction detail with contract info
      navigate(`/transaction/${contractData.id}`);
    }
  };

  // Format amount with commas
  const formatAmount = (amount: number) => {
    return amount.toLocaleString("ko-KR");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="mb-8">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-success" />
            <div className="absolute inset-0 w-24 h-24 bg-success/20 rounded-full animate-ping" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-text-primary text-center mb-4">
          계약서 등록 완료!
        </h2>

        <p className="text-base text-text-secondary text-center mb-2">
          월세 선납 계약이 성공적으로 등록되었습니다.
        </p>

        <p className="text-sm text-text-muted text-center mb-8">
          이제 월세를 선납하고 혜택을 받으실 수 있습니다.
        </p>

        <div className="bg-background-secondary rounded-lg p-4 w-full max-w-sm mb-8">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">계약 번호</span>
              <span className="text-sm font-medium text-text-primary">
                {contractData?.id || "SP-2025-0001"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">물건명</span>
              <span className="text-sm font-medium text-text-primary">
                {contractData?.name || "계약서"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">월세</span>
              <span className="text-sm font-medium text-text-primary">
                {contractData
                  ? `${formatAmount(contractData.monthlyRent)}원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">관리비</span>
              <span className="text-sm font-medium text-text-primary">
                {contractData
                  ? `${formatAmount(contractData.managementFee)}원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">월 납부액</span>
              <span className="text-sm font-bold text-primary">
                {contractData
                  ? `${formatAmount(contractData.monthlyRent + contractData.managementFee)}원`
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">등록 일시</span>
              <span className="text-sm font-medium text-text-primary">
                {new Date().toLocaleDateString("ko-KR")}{" "}
                {new Date().toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">상태</span>
              <span className="text-sm font-medium text-success">활성</span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <PrimaryButton onClick={onComplete} fullWidth>
            홈으로 돌아가기
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
