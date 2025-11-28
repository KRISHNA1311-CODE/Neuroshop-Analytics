export interface UserProfile {
  id: string;
  age: number;
  gender: string;
  location: string;
  income: number;
  interests: string;
  lastLoginDaysAgo: number;
  purchaseFrequency: number;
  averageOrderValue: number;
  totalSpending: number;
  productCategoryPreference: string;
  timeSpentMinutes: number;
  pagesViewed: number;
  newsletterSubscription: boolean;
}

export interface RecommendationResponse {
  recommendedProducts: string[];
  reasoning: string;
  marketingSubjectLine: string;
  churnRisk: 'Low' | 'Medium' | 'High';
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  EXPLORER = 'EXPLORER',
  RECOMMENDER = 'RECOMMENDER'
}
