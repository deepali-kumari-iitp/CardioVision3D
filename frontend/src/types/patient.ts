export type PatientInput = {
  Age: number
  Weight: number
  Length: number
  Sex: 'Male' | 'Fmale'
  BMI: number
  DM: number
  HTN: number
  'Current Smoker': number
  'EX-Smoker': number
  FH: number
  Obesity: 'Y' | 'N'
  CRF: 'Y' | 'N'
  CVA: 'Y' | 'N'
  'Airway disease': 'Y' | 'N'
  'Thyroid Disease': 'Y' | 'N'
  CHF: 'Y' | 'N'
  DLP: 'Y' | 'N'
  BP: number
  PR: number
  Edema: number
  'Weak Peripheral Pulse': 'Y' | 'N'
  'Lung rales': 'Y' | 'N'
  'Systolic Murmur': 'Y' | 'N'
  'Diastolic Murmur': 'Y' | 'N'
  'Typical Chest Pain': number
  Dyspnea: 'Y' | 'N'
  'Function Class': number
  Atypical: 'Y' | 'N'
  Nonanginal: 'Y' | 'N'
  'LowTH Ang': 'Y' | 'N'
  'Q Wave': number
  'St Elevation': number
  'St Depression': number
  Tinversion: number
  LVH: 'Y' | 'N'
  'Poor R Progression': 'Y' | 'N'
  BBB: 'N' | 'LBBB' | 'RBBB'
  FBS: number
  CR: number
  TG: number
  LDL: number
  HDL: number
  BUN: number
  ESR: number
  HB: number
  K: number
  Na: number
  WBC: number
  Lymph: number
  Neut: number
  PLT: number
  'EF-TTE': number
  'Region RWMA': number
  VHD: 'N' | 'mild' | 'Moderate' | 'Severe'
}