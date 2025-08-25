import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ContractNameStep } from "./steps/ContractNameStep";
import { TenantInfoStep } from "./steps/TenantInfoStep";
import { LandlordInfoStep } from "./steps/LandlordInfoStep";
import { ContractUploadStep } from "./steps/ContractUploadStep";
import { LoadingStep } from "./steps/LoadingStep";
import { CompletionStep } from "./steps/CompletionStep";
import { MobileContainer } from "@/components/layout/MobileContainer";

export type PrepaymentStep =
  | "contract-name"
  | "tenant-info"
  | "landlord-info"
  | "contract-upload"
  | "loading"
  | "completion";

export interface ContractFormData {
  // Step 1: Contract Name
  contractName?: string;

  // Step 2: Tenant Info
  tenantName?: string;
  tenantPhone?: string;
  tenantIdNumber?: string;

  // Step 3: Landlord Info
  paymentDay?: string;
  landlordName?: string;
  landlordPhone?: string;
  monthlyRent?: string;
  managementFee?: string;
  landlordBank?: string;
  landlordAccount?: string;

  // Step 4: Contract Upload
  contractFile?: File;
  contractStartDate?: string;
  contractEndDate?: string;
}

export const PrepaymentFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] =
    useState<PrepaymentStep>("contract-name");
  const [formData, setFormData] = useState<ContractFormData>({});

  const handleBack = () => {
    const stepOrder: PrepaymentStep[] = [
      "contract-name",
      "tenant-info",
      "landlord-info",
      "contract-upload",
    ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      navigate("/");
    }
  };

  const handleNext = (stepData: Partial<ContractFormData>) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    switch (currentStep) {
      case "contract-name":
        setCurrentStep("tenant-info");
        break;
      case "tenant-info":
        setCurrentStep("landlord-info");
        break;
      case "landlord-info":
        setCurrentStep("contract-upload");
        break;
      case "contract-upload":
        // Start loading animation
        setCurrentStep("loading");
        // Simulate API call
        setTimeout(() => {
          setCurrentStep("completion");
        }, 3000);
        break;
      case "completion":
        navigate("/");
        break;
    }
  };

  const handleComplete = () => {
    navigate("/");
  };

  // Get navigation tabs for current step
  const getNavigationTabs = () => {
    if (
      currentStep === "loading" ||
      currentStep === "completion" ||
      currentStep === "contract-name"
    ) {
      return undefined;
    }

    return [
      {
        id: "tenant",
        label: "임차인 정보",
        isActive: currentStep === "tenant-info",
        isCompleted: ["landlord-info", "contract-upload"].includes(currentStep),
      },
      {
        id: "landlord",
        label: "임대인 정보",
        isActive: currentStep === "landlord-info",
        isCompleted: currentStep === "contract-upload",
      },
      {
        id: "contract",
        label: "계약서 등록",
        isActive: currentStep === "contract-upload",
        isCompleted: false,
      },
    ];
  };

  const renderStep = () => {
    switch (currentStep) {
      case "contract-name":
        return (
          <ContractNameStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case "tenant-info":
        return (
          <TenantInfoStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            navigationTabs={getNavigationTabs()}
          />
        );
      case "landlord-info":
        return (
          <LandlordInfoStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            navigationTabs={getNavigationTabs()}
          />
        );
      case "contract-upload":
        return (
          <ContractUploadStep
            data={formData}
            onNext={handleNext}
            onBack={handleBack}
            navigationTabs={getNavigationTabs()}
          />
        );
      case "loading":
        return <LoadingStep />;
      case "completion":
        return <CompletionStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return <MobileContainer>{renderStep()}</MobileContainer>;
};
