export interface ProjectModel {
  createdAt: string;
  creator: {
    email: string;
    name: string;
    _id: string;
    features: {
      notification: {
        count: number;
        spent: number;
      };
      nps: {
        count: number;
        spent: number;
      };
      promotion: {
        count: number;
        spent: number;
      };
    };
  };
  domain: Array<{
    apiKey: string;
    createdAt: string;
    isActive: boolean;
    mode: string;
    origin: string;
    updatedAt: string;
    _id: string;
  }>;
  isActive: boolean;
  members: Array<{
    email: string;
    name: string;
    _id: string;
  }>;
  name: string;
  updatedAt: string;
  _id: string;
}

export interface PromotionPositionModel {
  position: string;
  value: string;
}

export interface NPSModes {
  mode: string;
  label: string;
}

export interface Currency {
  code: string;
  default: boolean;
  name: string;
  rateToUSD: number;
  sign: string;
  _id: string;
}

export interface GenderModel {
  name: string;
  code: string;
  _id: string;
}

export interface PlanModel {
  amount: number;
  currency: string;
  description: string;
  name: string;
  notes: Array<string>;
  requestCount: number;
  _id: string;
}
