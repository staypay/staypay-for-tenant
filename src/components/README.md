# StayPay Component Library

This component library provides all the necessary UI components for the StayPay application, organized in a modular and reusable structure.

## Component Structure

```
src/components/
├── core/               # Core layout components
├── forms/              # Form input components
├── transactions/       # Transaction and contract components
├── ui/                 # UI primitives and display components
├── pages/              # Page-level components
└── index.ts           # Central export file
```

## Usage

All components are exported from the central index file:

```tsx
import { 
  HomePage, 
  TextField, 
  Button, 
  TransactionCard 
} from '@/components';
```

## Component Categories

### Core Components
- **Header**: Main app header with navigation support
- **BottomTabBar**: Bottom navigation for mobile app

### Form Components  
- **TextField**: Text input with validation
- **MoneyInput**: Currency input field
- **DatePicker**: Date selection
- **Dropdown**: Select dropdown
- **BankSelector**: Bank selection with account verification
- **FileUpload**: File upload with drag & drop

### Transaction Components
- **TransactionCard**: Display transaction information
- **ContractCard**: Display contract details
- **TransactionList**: List of transactions

### UI Components
- **Button**: Various button styles and sizes
- **StatusBadge**: Status indicators
- **InfoDisplay**: Information display components
- **LoadingSpinner**: Loading states
- **ProgressIndicator**: Multi-step progress

### Page Components
- **HomePage**: Demo home page layout (기본 데모)
- **StayPayHomePage**: 실제 StayPay 홈 페이지 (Figma 디자인 구현)
- **HistoryPage**: Transaction history page
- **PrepaymentFlow**: Multi-step prepayment flow

## Routes

- `/` - StayPay 홈 페이지 (실제 서비스 화면)
- `/history` - 거래 내역 페이지
- `/demo` - 컴포넌트 데모 페이지
- `/demo-old` - 기존 홈페이지 데모

## Design System

The components follow the StayPay design system with:
- Consistent color palette (Primary: #1E64DD)
- Pretendard font family
- Mobile-first responsive design
- Tailwind CSS utility classes

## Key Features

- ✅ Fully typed with TypeScript
- ✅ Modular and reusable
- ✅ Follows Figma design specifications
- ✅ Mobile-optimized (390px width)
- ✅ Accessible
- ✅ Minimal code duplication

## StayPayHomePage Implementation

The main home page (`/src/pages/StayPayHomePage.tsx`) implements the Figma design using existing components:

### Used Components
- `ToggleButtonGroup` - 빌리기/빌려주기 모드 전환
- `LoanSummary` - 대출 정보 표시 (한도, 현재 대출액, 상환일)
- `QuickActionCard` - "월세 선납하기" 빠른 실행 버튼
- `TransactionList` - 거래 내역 리스트
- `StatusBadge` - 거래 상태 표시 (송금 준비중, 송금 완료, 상환완료)
- `BottomTabBar` - 하단 네비게이션

### Dummy Data Structure
```typescript
{
  id: string,
  title: string,        // 거래 제목
  subtitle: string,     // 날짜
  amount: number,       // 금액
  currency: 'KRWS',    // 통화
  status: 'pending' | 'completed' | 'success'  // 상태
}
```