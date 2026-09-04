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
    // Only seed dummy data for the explicit demo user account 'user_demo_default'
    if (!userId || userId !== 'user_demo_default') {
      return;
    }

    const existingProfile = await this.get<UserProfile>('profiles', userId);
    if (!existingProfile) {
      await this.put<UserProfile>('profiles', {
        userId,
        country: 'India',
        currency: 'INR',
        timezone: 'Asia/Kolkata',
        monthlyIncome: 0,
        savingsGoal: 0,
        occupation: '',
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
      });
    }
  }

  async clearDummyDataForUser(userId: string) {
    if (!userId || userId === 'user_demo_default') return;

    try {
      const dummyIncomes = await this.getAll<IncomeRecord>('incomes', userId);
      for (const inc of dummyIncomes) {
        if (inc.id.startsWith('inc_1_') || inc.id.startsWith('inc_2_')) {
          await this.delete('incomes', inc.id).catch(() => {});
        }
      }

      const dummyExpenses = await this.getAll<ExpenseRecord>('expenses', userId);
      for (const exp of dummyExpenses) {
        if (
          exp.id.startsWith('exp_1_') ||
          exp.id.startsWith('exp_2_') ||
          exp.id.startsWith('exp_3_') ||
          exp.id.startsWith('exp_4_') ||
          exp.id.startsWith('exp_5_')
        ) {
          await this.delete('expenses', exp.id).catch(() => {});
        }
      }

      const dummyBudgets = await this.getAll<BudgetRecord>('budgets', userId);
      for (const b of dummyBudgets) {
        if (b.id.startsWith('b_1_')) {
          await this.delete('budgets', b.id).catch(() => {});
        }
      }

      const dummyDebts = await this.getAll<DebtRecord>('debts', userId);
      for (const d of dummyDebts) {
        if (d.id.startsWith('d_1_') || d.id.startsWith('d_2_')) {
          await this.delete('debts', d.id).catch(() => {});
        }
      }

      const dummyGoals = await this.getAll<GoalRecord>('goals', userId);
      for (const g of dummyGoals) {
        if (g.id.startsWith('g_1_') || g.id.startsWith('g_2_')) {
          await this.delete('goals', g.id).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Error clearing dummy data for user:', e);
    }
  }
}

export const db = new FinanceDatabase();
