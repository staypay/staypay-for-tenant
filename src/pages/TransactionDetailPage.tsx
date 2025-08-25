import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Home,
  User,
  CreditCard,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";
import { Header } from "@/components";
import { generateTransactions, generateContracts } from "@/lib/dummyData";
import { MobileContainer } from "@/components/layout/MobileContainer";

interface TransactionDetail {
  id: string;
  contractId: string;
  contractName: string;
  title: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  date: string;
  time: string;
  paymentMethod: string;
  propertyAddress: string;
  landlordName: string;
  landlordPhone: string;
  tenantName: string;
  tenantPhone: string;
  monthlyRent: number;
  managementFee: number;
  paymentDay: number;
  transactionHash?: string;
  timeline: Array<{
    status: string;
    message: string;
    timestamp: string;
  }>;
}

export const TransactionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [transaction, setTransaction] = useState<TransactionDetail | null>(
    null
  );

  useEffect(() => {
    // Simulate loading transaction details
    const loadTransaction = async () => {
      setIsLoading(true);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate dummy transaction detail
      const transactions = generateTransactions(10);
      const contracts = generateContracts(3);
      const baseTransaction =
        transactions.find((t) => t.id === id) || transactions[0];
      const contract = contracts[0];

      const detail: TransactionDetail = {
        id: baseTransaction.id,
        contractId: contract.id,
        contractName: contract.name,
        title: baseTransaction.title,
        amount: baseTransaction.amount,
        currency: baseTransaction.currency || "KRWS",
        status: baseTransaction.status || "completed",
        date: baseTransaction.date || "2025-01-24",
        time: "14:32:15",
        paymentMethod: "StayPay 월세 선납",
        propertyAddress: "서울시 강남구 테헤란로 123, A빌라 301호",
        landlordName: contract.landlordName,
        landlordPhone: contract.landlordPhone,
        tenantName: contract.tenantName,
        tenantPhone: contract.tenantPhone,
        monthlyRent: contract.monthlyRent,
        managementFee: contract.managementFee,
        paymentDay: contract.paymentDay,
        transactionHash:
          baseTransaction.status === "completed"
            ? `0x${Math.random().toString(16).substr(2, 64)}`
            : undefined,
        timeline: generateTimeline(baseTransaction.status || "completed"),
      };

      setTransaction(detail);
      setIsLoading(false);
    };

    loadTransaction();
  }, [id]);

  const generateTimeline = (status: string) => {
    const baseTimeline = [
      {
        status: "created",
        message: "거래 생성됨",
        timestamp: "2025-01-24 14:30:00",
      },
      {
        status: "processing",
        message: "결제 처리 중",
        timestamp: "2025-01-24 14:31:00",
      },
    ];

    if (status === "completed") {
      baseTimeline.push(
        {
          status: "blockchain",
          message: "블록체인 등록 중",
          timestamp: "2025-01-24 14:31:30",
        },
        {
          status: "completed",
          message: "송금 완료",
          timestamp: "2025-01-24 14:32:15",
        }
      );
    } else if (status === "failed") {
      baseTimeline.push({
        status: "failed",
        message: "결제 실패",
        timestamp: "2025-01-24 14:31:45",
      });
    }

    return baseTimeline;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-success" />;
      case "processing":
        return <Clock className="w-6 h-6 text-primary animate-pulse" />;
      case "pending":
        return <AlertCircle className="w-6 h-6 text-warning" />;
      case "failed":
        return <XCircle className="w-6 h-6 text-danger" />;
      default:
        return <Clock className="w-6 h-6 text-text-muted" />;
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "대기중",
      processing: "처리중",
      completed: "완료",
      failed: "실패",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: "text-warning",
      processing: "text-primary",
      completed: "text-success",
      failed: "text-danger",
    };
    return colorMap[status] || "text-text-muted";
  };

  const handleDownloadReceipt = () => {
    // Simulate receipt download
    alert("영수증 다운로드 기능은 준비 중입니다.");
  };

  const handleShare = () => {
    // Simulate share
    if (navigator.share) {
      navigator.share({
        title: "거래 상세",
        text: `StayPay 거래: ${transaction?.title} - ${transaction?.amount.toLocaleString("ko-KR")}원`,
        url: window.location.href,
      });
    } else {
      alert("공유 기능은 준비 중입니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-mobile mx-auto">
        <Header title="거래 상세" showBackButton onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <MobileContainer>
        <Header title="거래 상세" showBackButton onBack={() => navigate(-1)} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted">거래를 찾을 수 없습니다.</p>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <Header
        title="거래 상세"
        showBackButton
        onBack={() => navigate(-1)}
        rightContent={
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-background-secondary rounded-lg"
            >
              <Share2 className="w-5 h-5 text-text-primary" />
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="p-2 hover:bg-background-secondary rounded-lg"
            >
              <Download className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-auto pb-6">
        {/* Status Section */}
        <div className="bg-white px-6 py-6 mb-2">
          <div className="flex items-center justify-center mb-4">
            {getStatusIcon(transaction.status)}
          </div>
          <h2
            className={`text-xl font-bold text-center mb-2 ${getStatusColor(transaction.status)}`}
          >
            {getStatusText(transaction.status)}
          </h2>
          <p className="text-2xl font-bold text-center text-text-primary mb-1">
            {transaction.amount.toLocaleString("ko-KR")} {transaction.currency}
          </p>
          <p className="text-sm text-center text-text-muted">
            {transaction.date} {transaction.time}
          </p>
        </div>

        {/* Transaction Info */}
        <div className="bg-white px-6 py-6 mb-2">
          <h3 className="text-base font-bold text-text-primary mb-4">
            거래 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted flex items-center gap-2">
                <Hash className="w-4 h-4" />
                거래번호
              </span>
              <span className="text-sm font-medium text-text-primary">
                {transaction.id}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted flex items-center gap-2">
                <FileText className="w-4 h-4" />
                거래유형
              </span>
              <span className="text-sm font-medium text-text-primary">
                {transaction.title}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                결제수단
              </span>
              <span className="text-sm font-medium text-text-primary">
                {transaction.paymentMethod}
              </span>
            </div>
            {transaction.transactionHash && (
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">블록체인 해시</span>
                <span className="text-xs font-mono text-primary">
                  {transaction.transactionHash.slice(0, 10)}...
                  {transaction.transactionHash.slice(-8)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Property Info */}
        <div className="bg-white px-6 py-6 mb-2">
          <h3 className="text-base font-bold text-text-primary mb-4">
            계약 정보
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-muted flex items-center gap-2">
                <Home className="w-4 h-4" />
                주소
              </span>
              <span className="text-sm font-medium text-text-primary text-right">
                {transaction.propertyAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">월세</span>
              <span className="text-sm font-medium text-text-primary">
                {transaction.monthlyRent.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted">관리비</span>
              <span className="text-sm font-medium text-text-primary">
                {transaction.managementFee.toLocaleString("ko-KR")}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-muted flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                납부일
              </span>
              <span className="text-sm font-medium text-text-primary">
                매월 {transaction.paymentDay}일
              </span>
            </div>
          </div>
        </div>

        {/* Parties Info */}
        <div className="bg-white px-6 py-6 mb-2">
          <h3 className="text-base font-bold text-text-primary mb-4">
            당사자 정보
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-background-secondary rounded-lg">
              <p className="text-xs text-text-muted mb-2">임대인</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium text-text-primary">
                  {transaction.landlordName}
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                {transaction.landlordPhone}
              </p>
            </div>
            <div className="p-3 bg-background-secondary rounded-lg">
              <p className="text-xs text-text-muted mb-2">임차인</p>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-text-muted" />
                <span className="text-sm font-medium text-text-primary">
                  {transaction.tenantName}
                </span>
              </div>
              <p className="text-sm text-text-muted mt-1">
                {transaction.tenantPhone}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white px-6 py-6">
          <h3 className="text-base font-bold text-text-primary mb-4">
            거래 타임라인
          </h3>
          <div className="space-y-4">
            {transaction.timeline.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === "completed"
                        ? "bg-success"
                        : item.status === "failed"
                          ? "bg-danger"
                          : item.status === "processing" ||
                              item.status === "blockchain"
                            ? "bg-primary"
                            : "bg-text-muted"
                    }`}
                  />
                  {index < transaction.timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-background-border mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-text-primary">
                    {item.message}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {item.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {transaction.status === "failed" && (
          <div className="px-6 py-4">
            <button className="w-full py-3 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
              다시 시도
            </button>
          </div>
        )}
      </div>
    </MobileContainer>
  );
};
