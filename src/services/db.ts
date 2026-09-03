// Native IndexedDB wrapper for local persistent database management

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  avatarUrl?: string;
  phone?: string;
  country: string;
  currency: string;
  timezone: string;
  occupation?: string;
  monthlyIncome: number;
  savingsGoal: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
}

export interface IncomeRecord {
  id: string;
  userId: string;
  amount: number;
  category: string;
  sourceLabel: string;
  dateReceived: string;
  recurringRuleId?: string;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  amount: number;
  category: string;
  paymentMethod: string;
  date: string;
  notes?: string;
}

export interface BudgetRecord {
  id: string;
  userId: string;
  month: string;
  overallLimit: number;
  categoryLimits: Record<string, number>;
}

export interface DebtRecord {
  id: string;
  userId: string;
  name: string;
  type: string;
  principal: number;
  remainingAmount: number;
  interestRate: number;
  emi?: number;
  dueDayOfMonth: number;
}

export interface GoalRecord {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

const DB_NAME = 'FinPilotDB';
const DB_VERSION = 2;

class FinanceDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = (event.target as IDBOpenDBRequest).transaction;

        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: false });
        } else if (transaction) {
          try {
            const userStore = transaction.objectStore('users');
            if (userStore.indexNames.contains('email')) {
              userStore.deleteIndex('email');
            }
            userStore.createIndex('email', 'email', { unique: false });
          } catch (e) {
            console.warn('Could not recreate email index:', e);
          }
        }

        if (!db.objectStoreNames.contains('profiles')) {
          db.createObjectStore('profiles', { keyPath: 'userId' });
        }

        if (!db.objectStoreNames.contains('incomes')) {
          const incomeStore = db.createObjectStore('incomes', { keyPath: 'id' });
          incomeStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('expenses')) {
          const expenseStore = db.createObjectStore('expenses', { keyPath: 'id' });
          expenseStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('budgets')) {
          const budgetStore = db.createObjectStore('budgets', { keyPath: 'id' });
          budgetStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('debts')) {
          const debtStore = db.createObjectStore('debts', { keyPath: 'id' });
          debtStore.createIndex('userId', 'userId', { unique: false });
        }

        if (!db.objectStoreNames.contains('goals')) {
          const goalStore = db.createObjectStore('goals', { keyPath: 'id' });
          goalStore.createIndex('userId', 'userId', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  async getAll<T>(storeName: string, userId?: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);

        if (userId && store.indexNames.contains('userId')) {
          const index = store.index('userId');
          const request = index.getAll(userId);
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        } else {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject(request.error);
        }
      });
    } catch (err) {
      console.error(`Error in getAll for store ${storeName}:`, err);
      return [];
    }
  }

  async get<T>(storeName: string, key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error(`Error in get for store ${storeName}:`, err);
      return null;
    }
  }

  async getByIndex<T>(storeName: string, indexName: string, key: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.get(key);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      console.error(`Error in getByIndex for store ${storeName}:`, err);
      return null;
    }
  }

  async put<T>(storeName: string, item: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const request = store.put(item);
        request.onsuccess = () => resolve(item);
        request.onerror = () => {
          console.warn(`IndexedDB put warning on store ${storeName}:`, request.error);
          resolve(item); // Fallback gracefully instead of breaking React rendering
        };
      });
    } catch (err) {
      console.warn(`IndexedDB put catch on store ${storeName}:`, err);
      return item;
    }
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async ensureDefaultUser(): Promise<UserAccount> {
    const defaultEmail = 'john.doe@example.com';
    let user = await this.getByIndex<UserAccount>('users', 'email', defaultEmail);

    if (!user) {
      user = {
        id: 'user_demo_default',
        email: defaultEmail,
        fullName: 'John Doe',
        passwordHash: btoa('password123'),
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      await this.put<UserAccount>('users', user);
      await this.seedUserData(user.id);
    }

    return user;
  }

  async seedUserData(userId: string) {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const existingProfile = await this.get<UserProfile>('profiles', userId);
    if (!existingProfile) {
      await this.put<UserProfile>('profiles', {
        userId,
        country: 'India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        monthlyIncome: 65000,
        savingsGoal: 100000,
        phone: '+91 98765 43210',
        occupation: 'Software Engineer',
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
      });
    }

    const existingIncomes = await this.getAll<IncomeRecord>('incomes', userId);
    if (existingIncomes.length === 0) {
      const defaultIncomes: IncomeRecord[] = [
        {
          id: `inc_1_${userId}`,
          userId,
          amount: 50000,
          category: 'SALARY',
          sourceLabel: 'Monthly Salary - Tech Corp',
          dateReceived: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        },
        {
          id: `inc_2_${userId}`,
          userId,
          amount: 15000,
          category: 'FREELANCING',
          sourceLabel: 'UI Design Client Project',
          dateReceived: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
        },
      ];

      for (const inc of defaultIncomes) {
        await this.put('incomes', inc);
      }
    }

    const existingExpenses = await this.getAll<ExpenseRecord>('expenses', userId);
    if (existingExpenses.length === 0) {
      const defaultExpenses: ExpenseRecord[] = [
        {
          id: `exp_1_${userId}`,
          userId,
          amount: 18000,
          category: 'HOUSING',
          paymentMethod: 'Bank Transfer',
          date: new Date(now.getFullYear(), now.getMonth(), 2).toISOString(),
        },
        {
          id: `exp_2_${userId}`,
          userId,
          amount: 6500,
          category: 'FOOD',
          paymentMethod: 'Credit Card',
          date: new Date(now.getFullYear(), now.getMonth(), 5).toISOString(),
        },
        {
          id: `exp_3_${userId}`,
          userId,
          amount: 3200,
          category: 'TRANSPORT',
          paymentMethod: 'Debit Card',
          date: new Date(now.getFullYear(), now.getMonth(), 8).toISOString(),
        },
        {
          id: `exp_4_${userId}`,
          userId,
          amount: 2800,
          category: 'UTILITIES',
          paymentMethod: 'UPI',
          date: new Date(now.getFullYear(), now.getMonth(), 12).toISOString(),
        },
        {
          id: `exp_5_${userId}`,
          userId,
          amount: 4500,
          category: 'ENTERTAINMENT',
          paymentMethod: 'Credit Card',
          date: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
        },
      ];

      for (const exp of defaultExpenses) {
        await this.put('expenses', exp);
      }
    }

    const existingBudgets = await this.getAll<BudgetRecord>('budgets', userId);
    if (existingBudgets.length === 0) {
      const defaultBudgets: BudgetRecord[] = [
        {
          id: `b_1_${userId}`,
          userId,
          month: currentMonth,
          overallLimit: 52000,
          categoryLimits: {
            HOUSING: 20000,
            FOOD: 10000,
            TRANSPORT: 5000,
            UTILITIES: 4000,
            ENTERTAINMENT: 6000,
          },
        },
      ];

      for (const b of defaultBudgets) {
        await this.put('budgets', b);
      }
    }

    const existingDebts = await this.getAll<DebtRecord>('debts', userId);
    if (existingDebts.length === 0) {
      const defaultDebts: DebtRecord[] = [
        {
          id: `d_1_${userId}`,
          userId,
          name: 'Car Loan',
          type: 'VEHICLE_LOAN',
          principal: 350000,
          remainingAmount: 140000,
          interestRate: 8.5,
          emi: 8500,
          dueDayOfMonth: 10,
        },
        {
          id: `d_2_${userId}`,
          userId,
          name: 'Credit Card Balance',
          type: 'CREDIT_CARD',
          principal: 40000,
          remainingAmount: 25000,
          interestRate: 14.0,
          emi: 3000,
          dueDayOfMonth: 20,
        },
      ];

      for (const d of defaultDebts) {
        await this.put('debts', d);
      }
    }

    const existingGoals = await this.getAll<GoalRecord>('goals', userId);
    if (existingGoals.length === 0) {
      const defaultGoals: GoalRecord[] = [
        {
          id: `g_1_${userId}`,
          userId,
          title: 'Emergency Fund',
          targetAmount: 150000,
          currentAmount: 95000,
          targetDate: '2026-12-31',
          category: 'SAVINGS',
        },
        {
          id: `g_2_${userId}`,
          userId,
          title: 'Vacation Trip to Japan',
          targetAmount: 120000,
          currentAmount: 48000,
          targetDate: '2027-04-15',
          category: 'TRAVEL',
        },
      ];

      for (const g of defaultGoals) {
        await this.put('goals', g);
      }
    }
  }
}

export const db = new FinanceDatabase();
