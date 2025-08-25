import React, { useState } from "react";
import { HeaderWithNavigation, StepButtonContainer } from "@/components";
import { PrimaryButton, TextField, SelectField } from "@/components";
import { ContractFormData } from "../PrepaymentFlow";

interface LandlordInfoStepProps {
  data: ContractFormData;
  onNext: (data: Partial<ContractFormData>) => void;
  onBack: () => void;
  navigationTabs?: any[];
}

const bankOptions = [
  { value: "", label: "은행 선택" },
  { value: "KB국민은행", label: "KB국민은행" },
  { value: "신한은행", label: "신한은행" },
  { value: "하나은행", label: "하나은행" },
  { value: "우리은행", label: "우리은행" },
  { value: "카카오뱅크", label: "카카오뱅크" },
  { value: "토스뱅크", label: "토스뱅크" },
  { value: "NH농협은행", label: "NH농협은행" },
  { value: "IBK기업은행", label: "IBK기업은행" },
];

export const LandlordInfoStep: React.FC<LandlordInfoStepProps> = ({
  data,
  onNext,
  onBack,
  navigationTabs,
}) => {
  const [formData, setFormData] = useState({
    paymentDay: data.paymentDay || "",
    landlordName: data.landlordName || "",
    landlordPhone: data.landlordPhone || "",
    monthlyRent: data.monthlyRent || "",
    managementFee: data.managementFee || "",
    landlordBank: data.landlordBank || "",
    landlordAccount: data.landlordAccount || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    let processedValue = value;

    // Auto-format phone number
    if (field === "landlordPhone") {
      const numbers = value.replace(/[^0-9]/g, "");
      if (numbers.length <= 3) {
        processedValue = numbers;
      } else if (numbers.length <= 7) {
        processedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      } else if (numbers.length <= 11) {
        processedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      } else {
        return; // Don't allow more than 11 digits
      }
    }

    // Format currency amounts
    if (field === "monthlyRent" || field === "managementFee") {
      processedValue = value.replace(/[^0-9]/g, "");
      if (processedValue && parseInt(processedValue) > 100000000) {
        return; // Max 100 million won
      }
    }

    // Payment day validation
    if (field === "paymentDay") {
      processedValue = value.replace(/[^0-9]/g, "");
      if (processedValue && parseInt(processedValue) > 31) {
        processedValue = "31";
      }
      if (processedValue && parseInt(processedValue) < 1) {
        processedValue = "1";
      }
    }

    // Account number formatting
    if (field === "landlordAccount") {
      processedValue = value.replace(/[^0-9-]/g, "");
      if (processedValue.replace(/-/g, "").length > 14) {
        return; // Max 14 digits
      }
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseInt(value);
    return number.toLocaleString("ko-KR");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.paymentDay.trim()) {
      newErrors.paymentDay = "납부일을 입력해주세요";
    } else if (
      parseInt(formData.paymentDay) < 1 ||
      parseInt(formData.paymentDay) > 31
    ) {
      newErrors.paymentDay = "올바른 날짜를 입력해주세요 (1-31)";
    }

    if (!formData.landlordName.trim()) {
      newErrors.landlordName = "임대인 이름을 입력해주세요";
    }

    if (!formData.landlordPhone.trim()) {
      newErrors.landlordPhone = "임대인 전화번호를 입력해주세요";
    } else if (
      !/^010-?\d{4}-?\d{4}$/.test(formData.landlordPhone.replace(/-/g, ""))
    ) {
      newErrors.landlordPhone = "올바른 전화번호 형식이 아닙니다";
    }

    if (!formData.monthlyRent.trim()) {
      newErrors.monthlyRent = "월세를 입력해주세요";
    } else if (parseInt(formData.monthlyRent) < 10000) {
      newErrors.monthlyRent = "월세는 10,000원 이상이어야 합니다";
    }

    if (!formData.managementFee.trim()) {
      newErrors.managementFee = "관리비를 입력해주세요";
    } else if (parseInt(formData.managementFee) < 0) {
      newErrors.managementFee = "관리비는 0원 이상이어야 합니다";
    }

    if (!formData.landlordBank) {
      newErrors.landlordBank = "은행을 선택해주세요";
    }

    if (!formData.landlordAccount.trim()) {
      newErrors.landlordAccount = "계좌번호를 입력해주세요";
    } else if (
      !/^\d{10,14}$/.test(formData.landlordAccount.replace(/-/g, ""))
    ) {
      newErrors.landlordAccount = "올바른 계좌번호 형식이 아닙니다";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <>
      <HeaderWithNavigation
        title="StayPay"
        showBackButton
        onBack={onBack}
        navigationTabs={navigationTabs}
      />

      <div className="px-6 py-8 pb-24">
        <h1 className="text-xl font-bold text-text-primary mb-8">
          임대인 정보를 입력해주세요
        </h1>

        <div className="space-y-6">
          <TextField
            label="납부일"
            placeholder="매달 몇일에 납부하시나요? (1-31)"
            value={formData.paymentDay}
            onChange={(e) => handleChange("paymentDay", e.target.value)}
            error={errors.paymentDay}
            required
            type="number"
            min="1"
            max="31"
          />

          <TextField
            label="임대인 이름"
            placeholder="성명"
            value={formData.landlordName}
            onChange={(e) => handleChange("landlordName", e.target.value)}
            error={errors.landlordName}
            required
          />

          <TextField
            label="임대인 전화번호"
            placeholder="010-0000-0000"
            value={formData.landlordPhone}
            onChange={(e) => handleChange("landlordPhone", e.target.value)}
            error={errors.landlordPhone}
            required
            type="tel"
          />

          <TextField
            label="월세"
            placeholder="월세 금액"
            value={
              formData.monthlyRent ? formatCurrency(formData.monthlyRent) : ""
            }
            onChange={(e) => handleChange("monthlyRent", e.target.value)}
            error={errors.monthlyRent}
            required
            type="text"
            suffix="원"
          />

          <TextField
            label="관리비"
            placeholder="관리비 금액"
            value={
              formData.managementFee
                ? formatCurrency(formData.managementFee)
                : ""
            }
            onChange={(e) => handleChange("managementFee", e.target.value)}
            error={errors.managementFee}
            required
            type="text"
            suffix="원"
          />

          <SelectField
            label="입금 은행"
            value={formData.landlordBank}
            onChange={(e) => handleChange("landlordBank", e.target.value)}
            error={errors.landlordBank}
            required
            options={bankOptions}
          />

          <TextField
            label="계좌번호"
            placeholder="계좌번호 입력"
            value={formData.landlordAccount}
            onChange={(e) => handleChange("landlordAccount", e.target.value)}
            error={errors.landlordAccount}
            required
            type="text"
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
