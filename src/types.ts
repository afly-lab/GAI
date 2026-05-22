export interface SourcingCluster {
  city: string;
  province: string;
  specialization: string;
}

export interface AuditResult {
  productName: string;
  riskScore: "Low" | "Medium" | "High";
  riskOverview: string;
  manufacturingClusters: SourcingCluster[];
  moqExpectation: string;
  targetPriceBenchmark: string;
  certificationRequirements: string[];
  onGroundInspectionChecklist: string[];
  ourRepresentationStrategy: string;
}

export interface InquireForm {
  name: string;
  email: string;
  subject: string;
  phone: string;
  company: string;
  product: string;
  budget: string;
  plan: string;
  message: string;
}
