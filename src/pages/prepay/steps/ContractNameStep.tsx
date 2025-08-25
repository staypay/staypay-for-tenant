import React, { useState } from "react";
import { HeaderWithNavigation, StepButtonContainer } from "@/components";
import { PrimaryButton, TextField } from "@/components";
import { ContractFormData } from "../PrepaymentFlow";

interface ContractNameStepProps {
  data: ContractFormData;
  onNext: (data: Partial<ContractFormData>) => void;
  onBack: () => void;
}

export const ContractNameStep: React.FC<ContractNameStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const [contractName, setContractName] = useState(data.contractName || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!contractName.trim()) {
      setError("계약 이름을 입력해주세요");
      return;
    }
    onNext({ contractName });
  };

  return (
    <>
      <HeaderWithNavigation title="StayPay" showBackButton onBack={onBack} />

      <div className="px-6 py-8">
        <h1 className="text-xl font-bold text-text-primary mb-8">
          계약 이름을 입력해주세요
        </h1>

        <div className="space-y-6">
          <TextField
            label="계약 이름"
            placeholder="예: A빌라 월세계약"
            value={contractName}
            onChange={(e) => {
              setContractName(e.target.value);
              setError("");
            }}
            error={error}
            required
          />
        </div>
      </div>

      <StepButtonContainer>
        <PrimaryButton onClick={handleNext} fullWidth>
          다음
        </PrimaryButton>
      </StepButtonContainer>
    </>
  );
};
