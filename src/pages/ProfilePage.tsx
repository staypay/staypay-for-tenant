import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Bell,
  FileText,
  LogOut,
  ChevronRight,
  Shield,
  Settings,
} from "lucide-react";
import { Header, BottomTabBar } from "@/components";
import {
  dummyUserProfile,
  apiSimulator,
  STORAGE_KEYS,
  localStorageHelper,
} from "@/lib/dummyData";
import { MobileContainer } from "@/components/layout/MobileContainer";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab] = useState("profile");
  const [userProfile, setUserProfile] = useState(dummyUserProfile);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user profile
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Check localStorage first
        const savedProfile = localStorageHelper.load(
          STORAGE_KEYS.USER_PROFILE,
          null
        );
        if (savedProfile) {
          setUserProfile(savedProfile);
        } else {
          // Fetch from "API"
          const profile = await apiSimulator.fetchUserProfile();
          setUserProfile(profile);
          localStorageHelper.save(STORAGE_KEYS.USER_PROFILE, profile);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleTabClick = (tabId: string) => {
    if (tabId === "home") {
      navigate("/");
    } else if (tabId === "history") {
      navigate("/history");
    }
  };

  const handleLogout = () => {
    // Clear all localStorage
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorageHelper.remove(key);
    });
    navigate("/login");
  };

  const menuItems = [
    {
      icon: Bell,
      label: "알림 설정",
      value: "켜짐",
      onClick: () => {},
    },
    {
      icon: CreditCard,
      label: "결제 수단 관리",
      value: "카드 1개",
      onClick: () => {},
    },
    {
      icon: FileText,
      label: "계약서 관리",
      value: "3개",
      onClick: () => navigate("/history"),
    },
    {
      icon: Shield,
      label: "개인정보 보호",
      value: "",
      onClick: () => {},
    },
    {
      icon: FileText,
      label: "이용약관",
      value: "",
      onClick: () => {},
    },
    {
      icon: Settings,
      label: "설정",
      value: "",
      onClick: () => {},
    },
  ];

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return "text-success";
    if (score >= 700) return "text-primary";
    if (score >= 600) return "text-warning";
    return "text-danger";
  };

  const getVerificationBadge = (status: string) => {
    const badgeConfig = {
      verified: { text: "인증완료", bg: "bg-success", color: "text-white" },
      pending: { text: "인증중", bg: "bg-warning", color: "text-white" },
      unverified: {
        text: "미인증",
        bg: "bg-background-tertiary",
        color: "text-text-muted",
      },
    };

    const config = badgeConfig[status as keyof typeof badgeConfig];
    return (
      <span
        className={`px-2 py-1 text-xs font-bold rounded ${config.bg} ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <MobileContainer>
      <Header title="프로필" />

      <div className="flex-1 pb-20 overflow-auto">
        {/* User Profile Section */}
        <div className="bg-white px-6 py-6 mb-2">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-text-primary">
                  {userProfile.name}
                </h2>
                {getVerificationBadge(userProfile.verificationStatus)}
              </div>
              <p className="text-sm text-text-muted">
                회원번호: {userProfile.id}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">
                {userProfile.phone}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">
                {userProfile.email}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-text-muted" />
              <span className="text-sm text-text-secondary">
                가입일: {userProfile.joinDate}
              </span>
            </div>
          </div>
        </div>

        {/* Credit Score Section */}
        <div className="bg-white px-6 py-6 mb-2">
          <h3 className="text-base font-bold text-text-primary mb-4">
            신용 정보
          </h3>

          <div className="bg-background-secondary rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-text-muted">신용점수</span>
              <span
                className={`text-2xl font-bold ${getCreditScoreColor(userProfile.creditScore)}`}
              >
                {userProfile.creditScore}
              </span>
            </div>

            <div className="h-2 bg-background-tertiary rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(userProfile.creditScore / 850) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">대출 한도</p>
                <p className="text-sm font-bold text-text-primary">
                  {userProfile.loanLimit.toLocaleString("ko-KR")}원
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">현재 대출</p>
                <p className="text-sm font-bold text-primary">
                  {userProfile.currentLoan.toLocaleString("ko-KR")}원
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-background-secondary transition-colors border-b border-background-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-text-muted" />
                <span className="text-sm font-medium text-text-secondary">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm text-text-muted">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="mt-6 px-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-white rounded-lg border border-danger text-danger font-medium hover:bg-danger/5 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        </div>

        {/* Version Info */}
        <div className="mt-8 mb-4 text-center">
          <p className="text-xs text-text-muted">StayPay v1.0.0</p>
          <p className="text-xs text-text-muted mt-1">
            © 2025 StayPay. All rights reserved.
          </p>
        </div>
      </div>

      <BottomTabBar activeTab={activeTab} onTabClick={handleTabClick} />
    </MobileContainer>
  );
};
