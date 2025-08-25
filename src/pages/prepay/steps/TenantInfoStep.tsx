import React, { useState } from "react";
import { HeaderWithNavigation, StepButtonContainer } from "@/components";
import { PrimaryButton, TextField } from "@/components";
import { ContractFormData } from "../PrepaymentFlow";

interface TenantInfoStepProps {
  data: ContractFormData;
  onNext: (data: Partial<ContractFormData>) => void;
  onBack: () => void;
  navigationTabs?: any[];
}

export const TenantInfoStep: React.FC<TenantInfoStepProps> = ({
  data,
  onNext,
  onBack,
  navigationTabs,
}) => {
  const [formData, setFormData] = useState({
    tenantName: data.tenantName || "",
    tenantPhone: data.tenantPhone || "",
    tenantIdNumber: data.tenantIdNumber || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    let formattedValue = value;

    // Auto-format phone number
    if (field === "tenantPhone") {
      const numbers = value.replace(/[^0-9]/g, "");
      if (numbers.length <= 3) {
        formattedValue = numbers;
      } else if (numbers.length <= 7) {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      } else if (numbers.length <= 11) {
        formattedValue = `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
      } else {
        return; // Don't allow more than 11 digits
      }
    }

    // Auto-format ID number
    if (field === "tenantIdNumber") {
      const numbers = value.replace(/[^0-9]/g, "");
      if (numbers.length <= 6) {
        formattedValue = numbers;
      } else if (numbers.length <= 13) {
        formattedValue = `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
      } else {
        return; // Don't allow more than 13 digits
      }
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = "이름을 입력해주세요";
    }

    if (!formData.tenantPhone.trim()) {
      newErrors.tenantPhone = "전화번호를 입력해주세요";
    } else if (
      !/^010-?\d{4}-?\d{4}$/.test(formData.tenantPhone.replace(/-/g, ""))
    ) {
      newErrors.tenantPhone = "올바른 전화번호 형식이 아닙니다";
    }

    if (!formData.tenantIdNumber.trim()) {
      newErrors.tenantIdNumber = "주민등록번호를 입력해주세요";
    } else if (
      !/^\d{6}-?\d{7}$/.test(formData.tenantIdNumber.replace(/-/g, ""))
    ) {
      newErrors.tenantIdNumber = "올바른 주민등록번호 형식이 아닙니다";
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

      <div className="px-6 py-8">
        <h1 className="text-xl font-bold text-text-primary mb-8">
          임차인 정보를 입력해주세요
        </h1>

        <div className="space-y-6">
          <TextField
            label="임차인 이름"
            placeholder="성명"
            value={formData.tenantName}
            onChange={(e) => handleChange("tenantName", e.target.value)}
            error={errors.tenantName}
            required
          />

          <TextField
            label="임차인 전화번호"
            placeholder="010-0000-0000"
            value={formData.tenantPhone}
            onChange={(e) => handleChange("tenantPhone", e.target.value)}
            error={errors.tenantPhone}
            required
            type="tel"
          />

          <TextField
            label="임차인 주민등록번호"
            placeholder="000000-0000000"
            value={formData.tenantIdNumber}
            onChange={(e) => handleChange("tenantIdNumber", e.target.value)}
            error={errors.tenantIdNumber}
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
