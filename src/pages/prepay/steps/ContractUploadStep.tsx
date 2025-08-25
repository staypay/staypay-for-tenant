import React, { useState, useRef } from "react";
import { HeaderWithNavigation, StepButtonContainer } from "@/components";
import { PrimaryButton, TextField } from "@/components";
import { Upload, X, FileText } from "lucide-react";
import { ContractFormData } from "../PrepaymentFlow";

interface ContractUploadStepProps {
  data: ContractFormData;
  onNext: (data: Partial<ContractFormData>) => void;
  onBack: () => void;
  navigationTabs?: any[];
}

export const ContractUploadStep: React.FC<ContractUploadStepProps> = ({
  data,
  onNext,
  onBack,
  navigationTabs,
}) => {
  const [formData, setFormData] = useState({
    contractFile: data.contractFile || (undefined as File | undefined),
    contractStartDate: data.contractStartDate || "",
    contractEndDate: data.contractEndDate || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          contractFile: "PDF 또는 이미지 파일만 업로드 가능합니다",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          contractFile: "파일 크기는 10MB 이하여야 합니다",
        }));
        return;
      }
      setFormData((prev) => ({ ...prev, contractFile: file }));
      setErrors((prev) => ({ ...prev, contractFile: "" }));
    }
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({ ...prev, contractFile: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.contractFile) {
      newErrors.contractFile = "계약서를 업로드해주세요";
    }

    if (!formData.contractStartDate) {
      newErrors.contractStartDate = "계약 시작일을 입력해주세요";
    }

    if (!formData.contractEndDate) {
      newErrors.contractEndDate = "계약 종료일을 입력해주세요";
    }

    if (formData.contractStartDate && formData.contractEndDate) {
      const startDate = new Date(formData.contractStartDate);
      const endDate = new Date(formData.contractEndDate);
      if (endDate <= startDate) {
        newErrors.contractEndDate = "계약 종료일은 시작일보다 늦어야 합니다";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    onNext(formData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
          계약서를 등록해주세요
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              계약서 업로드 <span className="text-danger">*</span>
            </label>

            {!formData.contractFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-lg p-8
                  flex flex-col items-center justify-center cursor-pointer
                  transition-colors hover:bg-background-secondary
                  ${errors.contractFile ? "border-danger" : "border-background-border"}
                `}
              >
                <Upload className="w-12 h-12 text-text-muted mb-3" />
                <p className="text-sm text-text-secondary font-medium mb-1">
                  파일을 선택하세요
                </p>
                <p className="text-xs text-text-muted">
                  PDF, JPG, PNG (최대 10MB)
                </p>
              </div>
            ) : (
              <div className="border border-background-border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {formData.contractFile.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {formatFileSize(formData.contractFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleFileRemove}
                  className="p-1 hover:bg-background-secondary rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-text-muted" />
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {errors.contractFile && (
              <p className="text-sm text-danger mt-1">{errors.contractFile}</p>
            )}
          </div>

          <TextField
            label="계약 시작일"
            placeholder="YYYY-MM-DD"
            value={formData.contractStartDate}
            onChange={(e) => handleChange("contractStartDate", e.target.value)}
            error={errors.contractStartDate}
            required
            type="date"
          />

          <TextField
            label="계약 종료일"
            placeholder="YYYY-MM-DD"
            value={formData.contractEndDate}
            onChange={(e) => handleChange("contractEndDate", e.target.value)}
            error={errors.contractEndDate}
            required
            type="date"
          />
        </div>
      </div>

      <StepButtonContainer>
        <PrimaryButton onClick={handleNext} fullWidth>
          다음
        </PrimaryButton>
      </StepButtonContainer>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 m-4 max-w-sm w-full">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              계약 정보 확인
            </h2>

            <div className="space-y-3 mb-6">
              <div>
                <p className="text-xs text-text-muted">계약명</p>
                <p className="text-sm font-medium text-text-primary">
                  {data.contractName}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">임차인</p>
                <p className="text-sm font-medium text-text-primary">
                  {data.tenantName}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">임대인</p>
                <p className="text-sm font-medium text-text-primary">
                  {data.landlordName}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">월세 / 관리비</p>
                <p className="text-sm font-medium text-text-primary">
                  {parseInt(data.monthlyRent || "0").toLocaleString("ko-KR")}원
                  /{" "}
                  {parseInt(data.managementFee || "0").toLocaleString("ko-KR")}
                  원
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">계약 기간</p>
                <p className="text-sm font-medium text-text-primary">
                  {formData.contractStartDate} ~ {formData.contractEndDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-text-muted">납부일</p>
                <p className="text-sm font-medium text-text-primary">
                  매월 {data.paymentDay}일
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 px-4 rounded-lg border border-background-border text-text-secondary font-medium hover:bg-background-secondary transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
