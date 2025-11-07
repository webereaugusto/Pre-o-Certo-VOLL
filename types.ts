
export interface PricingInputs {
  fixedCosts: {
    rent: number;
    utilities: number;
    accounting: number;
    ownerSalary: number;
    staffSalary: number;
    consumables: number;
    other: number;
  };
  variableCosts: {
    creditCardFee: number;
    taxes: number;
    depreciation: number;
  };
  profitMargin: number;
  capacity: {
    clientsPerHour: number;
    hoursPerDay: number;
    workingDays: {
      mon: boolean;
      tue: boolean;
      wed: boolean;
      thu: boolean;
      fri: boolean;
      sat: boolean;
    };
    occupancyRate: number;
  };
  marketAnalysis: {
    competitorPrice: number;
  };
}

export interface CalculatedResults {
  totalFixedCosts: number;
  targetRevenue: number;
  realSessionsPerMonth: number;
  equivalentClients2x: number;
  pricePerSession: number;
  packages: {
    '1x': number;
    '2x': number;
    '3x': number;
  };
  financialPlanning: {
    payroll: number;
    operational: number;
    reserve: number;
    workingCapital: number;
  };
  breakEven: {
    sessionsPerMonth: number;
    monthlyRevenue: number;
  };
  emergencyReserve: {
    totalNeeded: number;
    monthlySaving12Months: number;
    monthlySaving24Months: number;
  };
  isValid: boolean;
}

export interface SimulationResults {
    newRevenue: number;
    newProfitValue: number;
    newProfitMargin: number;
    isSimulating: boolean;
}