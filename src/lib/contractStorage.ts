import { TransactionData } from "@/components/transactions/TransactionCard";
import {
  ContractData,
  PaymentRecord,
  localStorageHelper,
  STORAGE_KEYS,
} from "./dummyData";
import { ContractFormData } from "@/pages/prepay/PrepaymentFlow";

export interface StoredContract extends ContractData {
  formData?: ContractFormData;
}

class ContractStorageService {
  private readonly CONTRACTS_KEY = STORAGE_KEYS.CONTRACTS;
  private readonly TRANSACTIONS_KEY = STORAGE_KEYS.TRANSACTIONS;

  // Generate unique contract ID
  generateContractId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const year = new Date().getFullYear();
    return `SP-${year}-${String(timestamp).slice(-4)}${String(random).padStart(3, "0")}`;
  }

  // Save a new contract
  saveContract(formData: ContractFormData): StoredContract {
    const contractId = this.generateContractId();
    const now = new Date();

    // Create contract object
    const contract: StoredContract = {
      id: contractId,
      name: formData.contractName || "",
      tenantName: formData.tenantName || "",
      tenantPhone: formData.tenantPhone || "",
      landlordName: formData.landlordName || "",
      landlordPhone: formData.landlordPhone || "",
      propertyAddress: "서울특별시 강남구", // Default address - could be added to form
      contractType: "월세",
      deposit: 10000000, // Default 10M KRW - could be added to form
      monthlyRent: parseInt(formData.monthlyRent || "0"),
      managementFee: parseInt(formData.managementFee || "0"),
      paymentDay: parseInt(formData.paymentDay || "5"),
      startDate: formData.contractStartDate || now.toISOString().split("T")[0],
      endDate:
        formData.contractEndDate ||
        new Date(now.getFullYear() + 2, now.getMonth(), now.getDate())
          .toISOString()
          .split("T")[0],
      status: "active",
      createdAt: now.toISOString(),
      paymentHistory: [],
      formData: formData,
    };

    // Save to localStorage
    const contracts = this.getAllContracts();
    contracts.unshift(contract); // Add to beginning of array
    localStorageHelper.save(this.CONTRACTS_KEY, contracts);

    // Create initial transaction
    this.createInitialTransaction(contract);

    return contract;
  }

  // Get all contracts
  getAllContracts(): StoredContract[] {
    return localStorageHelper.load<StoredContract[]>(this.CONTRACTS_KEY, []);
  }

  // Get active contracts
  getActiveContracts(): StoredContract[] {
    const contracts = this.getAllContracts();
    return contracts.filter((contract) => contract.status === "active");
  }

  // Get contract by ID
  getContractById(id: string): StoredContract | null {
    const contracts = this.getAllContracts();
    return contracts.find((contract) => contract.id === id) || null;
  }

  // Update contract
  updateContract(id: string, updates: Partial<StoredContract>): boolean {
    const contracts = this.getAllContracts();
    const index = contracts.findIndex((contract) => contract.id === id);

    if (index === -1) return false;

    contracts[index] = { ...contracts[index], ...updates };
    localStorageHelper.save(this.CONTRACTS_KEY, contracts);
    return true;
  }

  // Add payment record to contract
  addPaymentRecord(
    contractId: string,
    payment: Omit<PaymentRecord, "id" | "contractId">
  ): PaymentRecord | null {
    const contract = this.getContractById(contractId);
    if (!contract) return null;

    const paymentRecord: PaymentRecord = {
      id: `payment-${contractId}-${Date.now()}`,
      contractId: contractId,
      ...payment,
    };

    if (!contract.paymentHistory) {
      contract.paymentHistory = [];
    }

    contract.paymentHistory.push(paymentRecord);
    this.updateContract(contractId, {
      paymentHistory: contract.paymentHistory,
    });

    // Also create a transaction record
    this.createTransactionFromPayment(contract, paymentRecord);

    return paymentRecord;
  }

  // Create initial transaction when contract is created
  private createInitialTransaction(contract: StoredContract) {
    const transactions = localStorageHelper.load<TransactionData[]>(
      this.TRANSACTIONS_KEY,
      []
    );
    const monthlyAmount = contract.monthlyRent + contract.managementFee;

    // Check if transaction already exists for this contract
    const existingTransaction = transactions.find((t) =>
      t.id.startsWith(`trans-${contract.id}`)
    );
    if (existingTransaction) {
      return; // Prevent duplicate
    }

    // Use date after June 2025
    const transDate = new Date("2025-08-01");
    const dueDate = new Date(transDate);
    dueDate.setMonth(dueDate.getMonth() + 1);

    // Create initial pending transaction with actual contract data
    const transaction: TransactionData = {
      id: `trans-${contract.id}`,
      title: `${contract.name}`,
      subtitle: `${transDate.toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")}`,
      amount: monthlyAmount,
      currency: "KRWS",
      date: transDate.toISOString().split("T")[0],
      status: "pending",
      dueDate: `${dueDate.toLocaleDateString("ko-KR").slice(2).replace(/\. /g, "/")}`,
      transferAmount: contract.monthlyRent,
      fee: 10000,
      landlordAccount: `${contract.formData?.landlordBank || "국민은행"}_${contract.formData?.landlordAccount || "12345678"}_${contract.landlordName}`,
      senderName: contract.tenantName,
    };

    transactions.unshift(transaction);
    localStorageHelper.save(this.TRANSACTIONS_KEY, transactions);
  }

  // Create transaction from payment record
  private createTransactionFromPayment(
    contract: StoredContract,
    payment: PaymentRecord
  ) {
    const transaction: TransactionData = {
      id: payment.transactionId || `trans-${payment.id}`,
      title: `${contract.name} ${payment.type === "deposit" ? "보증금" : "월세"}`,
      subtitle: payment.paymentDate,
      amount: payment.amount,
      currency: "KRWS",
      date: payment.paymentDate,
      status: payment.status,
    };

    const transactions = localStorageHelper.load<TransactionData[]>(
      this.TRANSACTIONS_KEY,
      []
    );
    transactions.unshift(transaction);
    localStorageHelper.save(this.TRANSACTIONS_KEY, transactions);
  }

  // Get transactions for a specific contract
  getContractTransactions(contractId: string): TransactionData[] {
    const transactions = localStorageHelper.load<TransactionData[]>(
      this.TRANSACTIONS_KEY,
      []
    );
    return transactions.filter((t) => t.id.includes(contractId));
  }

  // Calculate total loan amount from active contracts
  calculateTotalLoanAmount(): number {
    const activeContracts = this.getActiveContracts();
    const processedIds = new Set<string>();
    let total = 0;

    // Get transactions from localStorage
    const transactions = localStorageHelper.load<TransactionData[]>(
      this.TRANSACTIONS_KEY,
      []
    );

    // Calculate from transactions (to avoid duplication)
    transactions.forEach((transaction) => {
      // Count transactions that represent active loans
      // pending (송금 준비 중) and processing (송금 완료) are active loans
      // completed (상환 완료) transactions are not counted
      if (
        transaction.status === "pending" ||
        transaction.status === "processing"
      ) {
        if (!processedIds.has(transaction.id)) {
          total += transaction.amount;
          processedIds.add(transaction.id);
        }
      }
    });

    // If no transactions exist, estimate from contracts
    if (transactions.length === 0 && activeContracts.length > 0) {
      activeContracts.forEach((contract) => {
        const monthlyAmount = contract.monthlyRent + contract.managementFee;
        total += monthlyAmount; // Assume 1 month prepaid
      });
    }

    // Cap at 2 million won
    return Math.min(total, 2000000);
  }

  // Clear all contracts (for testing/reset)
  clearAllContracts() {
    localStorageHelper.save(this.CONTRACTS_KEY, []);
    localStorageHelper.save(this.TRANSACTIONS_KEY, []);
  }
}

// Export singleton instance
export const contractStorage = new ContractStorageService();
