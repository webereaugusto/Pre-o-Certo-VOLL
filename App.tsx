
import React, { useState, useMemo, ChangeEvent, useEffect } from 'react';
import { PricingInputs, CalculatedResults, SimulationResults } from './types';
import Card from './components/Card';
import InputField from './components/InputField';
import SliderField from './components/SliderField';
import Results from './components/Results';
import DaySelector from './components/DaySelector';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<PricingInputs>({
    fixedCosts: {
      rent: 1500,
      utilities: 500,
      accounting: 300,
      ownerSalary: 3000,
      staffSalary: 2000,
      consumables: 200,
      other: 0,
    },
    variableCosts: {
      creditCardFee: 5,
      taxes: 6,
      depreciation: 1,
    },
    profitMargin: 20,
    capacity: {
      clientsPerHour: 3,
      hoursPerDay: 8,
      workingDays: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
      },
      occupancyRate: 70,
    },
    marketAnalysis: {
      competitorPrice: 0,
    }
  });

  const [simulatedPackages, setSimulatedPackages] = useState<CalculatedResults['packages']>({ '1x': 0, '2x': 0, '3x': 0 });


  const handleInputChange = (
    section: 'fixedCosts' | 'capacity' | 'marketAnalysis',
    field: string
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setInputs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };
  
  const handleDayToggle = (day: keyof PricingInputs['capacity']['workingDays']) => {
    setInputs(prev => ({
      ...prev,
      capacity: {
        ...prev.capacity,
        workingDays: {
          ...prev.capacity.workingDays,
          [day]: !prev.capacity.workingDays[day],
        }
      }
    }));
  };

  const handleSliderChange = (
    section: 'variableCosts' | 'capacity',
    field: string
  ) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setInputs(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleProfitChange = (e: ChangeEvent<HTMLInputElement>) => {
     const value = parseInt(e.target.value, 10);
     setInputs(prev => ({...prev, profitMargin: value }));
  }

  const handlePackageChange = (key: keyof CalculatedResults['packages'], value: string) => {
    const numericValue = parseFloat(value) || 0;
    setSimulatedPackages(prev => ({
        ...prev,
        [key]: numericValue,
    }));
  };

  const results = useMemo<CalculatedResults>(() => {
    const totalFixedCosts = Object.values(inputs.fixedCosts).reduce((a: number, b: number) => a + b, 0);
    
    const variableCostsPercentage = (inputs.variableCosts.creditCardFee + inputs.variableCosts.taxes + inputs.variableCosts.depreciation) / 100;
    const profitPercentage = inputs.profitMargin / 100;

    const denominatorProfit = 1 - variableCostsPercentage - profitPercentage;
    const denominatorBreakEven = 1 - variableCostsPercentage;

    if (denominatorProfit <= 0 || denominatorBreakEven <= 0) {
      const emptyResults = {
        totalFixedCosts,
        targetRevenue: 0,
        realSessionsPerMonth: 0,
        equivalentClients2x: 0,
        pricePerSession: 0,
        packages: { '1x': 0, '2x': 0, '3x': 0 },
        financialPlanning: { payroll: 0, operational: 0, reserve: 0, workingCapital: 0 },
        breakEven: { sessionsPerMonth: 0, monthlyRevenue: 0 },
        emergencyReserve: { totalNeeded: 0, monthlySaving12Months: 0, monthlySaving24Months: 0 },
        isValid: false,
      };
      return emptyResults;
    }

    const targetRevenue = totalFixedCosts / denominatorProfit;
    const breakEvenRevenue = totalFixedCosts / denominatorBreakEven;
    
    const WEEKS_PER_MONTH = 4.33;
    const daysPerWeek = Object.values(inputs.capacity.workingDays).filter(Boolean).length;
    const workingDaysPerMonth = daysPerWeek * WEEKS_PER_MONTH;

    // FIX: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.
    // Using Number() to cast values from state, which may have an inferred union type, to number before arithmetic operations.
    const theoreticalSessions = Number(inputs.capacity.clientsPerHour) * Number(inputs.capacity.hoursPerDay) * workingDaysPerMonth;
    const realSessionsPerMonth = theoreticalSessions * (Number(inputs.capacity.occupancyRate) / 100);

    const pricePerSession = realSessionsPerMonth > 0 ? targetRevenue / realSessionsPerMonth : 0;
    
    const breakEvenSessions = pricePerSession > 0 ? breakEvenRevenue / pricePerSession : 0;
    
    const packages = {
      '1x': pricePerSession * 5,
      '2x': pricePerSession * 9,
      '3x': pricePerSession * 13,
    };
    
    const equivalentClients2x = realSessionsPerMonth > 0 ? realSessionsPerMonth / 9 : 0;

    const financialPlanning = {
        payroll: targetRevenue * 0.40,
        operational: targetRevenue * 0.30,
        reserve: targetRevenue * 0.20,
        workingCapital: targetRevenue * 0.10,
    };

    const emergencyReserveTotal = totalFixedCosts * 6;
    const emergencyReserve = {
        totalNeeded: emergencyReserveTotal,
        monthlySaving12Months: emergencyReserveTotal / 12,
        monthlySaving24Months: emergencyReserveTotal / 24,
    };

    return {
      totalFixedCosts,
      targetRevenue,
      realSessionsPerMonth,
      equivalentClients2x,
      pricePerSession,
      packages,
      financialPlanning,
      breakEven: {
        sessionsPerMonth: breakEvenSessions,
        monthlyRevenue: breakEvenRevenue,
      },
      emergencyReserve,
      isValid: true,
    };
  }, [inputs]);

  useEffect(() => {
    if (results.isValid) {
        setSimulatedPackages(results.packages);
    }
    // FIX: The dependency on `results.packages` (an object) caused an infinite re-render loop.
    // By depending on the primitive values within the object, the effect only runs when the values actually change.
  }, [results.isValid, results.packages['1x'], results.packages['2x'], results.packages['3x']]);

  const simulationResults = useMemo<SimulationResults>(() => {
    if (!results.isValid) return { newRevenue: 0, newProfitValue: 0, newProfitMargin: 0, isSimulating: false };

    // Sessions per package
    const sessions = { '1x': 5, '2x': 9, '3x': 13 };

    const pricePerSessionSimulated1x = simulatedPackages['1x'] > 0 ? simulatedPackages['1x'] / sessions['1x'] : 0;
    const pricePerSessionSimulated2x = simulatedPackages['2x'] > 0 ? simulatedPackages['2x'] / sessions['2x'] : 0;
    const pricePerSessionSimulated3x = simulatedPackages['3x'] > 0 ? simulatedPackages['3x'] / sessions['3x'] : 0;

    const validPrices = [pricePerSessionSimulated1x, pricePerSessionSimulated2x, pricePerSessionSimulated3x].filter(p => p > 0);
    const avgSimulatedPricePerSession = validPrices.length > 0 ? validPrices.reduce((a,b) => a + b, 0) / validPrices.length : 0;


    // FIX: The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type. Cast to number for safety.
    const newRevenue = avgSimulatedPricePerSession * Number(results.realSessionsPerMonth);

    const variableCostsPercentage = (inputs.variableCosts.creditCardFee + inputs.variableCosts.taxes + inputs.variableCosts.depreciation) / 100;
    const totalVariableCostValue = newRevenue * variableCostsPercentage;
    
    const newProfitValue = newRevenue - results.totalFixedCosts - totalVariableCostValue;
    const newProfitMargin = newRevenue > 0 ? (newProfitValue / newRevenue) * 100 : 0;
    
    const isSimulating = Math.round(results.packages['1x']) !== Math.round(simulatedPackages['1x']) ||
                         Math.round(results.packages['2x']) !== Math.round(simulatedPackages['2x']) ||
                         Math.round(results.packages['3x']) !== Math.round(simulatedPackages['3x']);

    return {
        newRevenue,
        newProfitValue,
        newProfitMargin,
        isSimulating,
    }

  }, [simulatedPackages, results, inputs.variableCosts]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900 text-white font-sans">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-cyan-500">
            PCI - PREÇO CERTO INTELIGENTE
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Determine o preço ideal e simule cenários para seu Studio de Pilates.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="space-y-8">
            <Card title="Custos Fixos Mensais">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField label="Aluguel / Condomínio" id="rent" value={inputs.fixedCosts.rent} onChange={handleInputChange('fixedCosts', 'rent')} />
                <InputField label="Água, Luz, Internet" id="utilities" value={inputs.fixedCosts.utilities} onChange={handleInputChange('fixedCosts', 'utilities')} />
                <InputField label="Contabilidade" id="accounting" value={inputs.fixedCosts.accounting} onChange={handleInputChange('fixedCosts', 'accounting')} />
                <InputField label="Seu Pró-labore" id="ownerSalary" value={inputs.fixedCosts.ownerSalary} onChange={handleInputChange('fixedCosts', 'ownerSalary')} tooltip="Sua retirada/salário mensal como dono do negócio." />
                <InputField label="Salário Equipe" id="staffSalary" value={inputs.fixedCosts.staffSalary} onChange={handleInputChange('fixedCosts', 'staffSalary')} />
                <InputField label="Material de Consumo" id="consumables" value={inputs.fixedCosts.consumables} onChange={handleInputChange('fixedCosts', 'consumables')} />
                <InputField label="Outros Custos Fixos" id="other" value={inputs.fixedCosts.other} onChange={handleInputChange('fixedCosts', 'other')} />
              </div>
            </Card>

            <Card title="Custos Variáveis e Lucro">
                <SliderField label="Taxa Cartão de Crédito" id="creditCardFee" value={inputs.variableCosts.creditCardFee} onChange={handleSliderChange('variableCosts', 'creditCardFee')} max={20}/>
                <SliderField label="Impostos (Simples Nacional)" id="taxes" value={inputs.variableCosts.taxes} onChange={handleSliderChange('variableCosts', 'taxes')} max={30} tooltip="Percentual total de impostos que incide sobre o faturamento." />
                <SliderField label="Depreciação Equipamentos" id="depreciation" value={inputs.variableCosts.depreciation} onChange={handleSliderChange('variableCosts', 'depreciation')} max={10} tooltip="Percentual guardado para manutenção e troca de equipamentos. (Recomendado: 1%)"/>
                <SliderField label="Margem de Lucro Desejada" id="profitMargin" value={inputs.profitMargin} onChange={handleProfitChange} max={50} tooltip="O lucro é reinvestido na empresa para crescimento. (Recomendado: mínimo 20%)" />
            </Card>
            
            <Card title="Capacidade Operacional">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <InputField label="Clientes por Horário" id="clientsPerHour" value={inputs.capacity.clientsPerHour} onChange={handleInputChange('capacity', 'clientsPerHour')} isCurrency={false} />
                <InputField label="Horas por Dia" id="hoursPerDay" value={inputs.capacity.hoursPerDay} onChange={handleInputChange('capacity', 'hoursPerDay')} isCurrency={false} />
              </div>
              <DaySelector workingDays={inputs.capacity.workingDays} onDayToggle={handleDayToggle} />
              <SliderField label="Taxa de Ocupação Média" id="occupancyRate" value={inputs.capacity.occupancyRate} onChange={handleSliderChange('capacity', 'occupancyRate')} tooltip="Qual a porcentagem de horários que estão preenchidos, em média?" />
            </Card>
            
            <Card title="Análise de Mercado">
                 <InputField label="Preço Médio da Concorrência (Plano 2x/semana)" id="competitorPrice" value={inputs.marketAnalysis.competitorPrice} onChange={handleInputChange('marketAnalysis', 'competitorPrice')} tooltip="Informe o valor médio cobrado por concorrentes na sua região para um plano similar." />
            </Card>

          </div>
          <div className="mt-8 lg:mt-0 lg:sticky lg:top-8 self-start">
            <Results results={results} simulatedPackages={simulatedPackages} handlePackageChange={handlePackageChange} simulationResults={simulationResults} competitorPrice={inputs.marketAnalysis.competitorPrice} />
          </div>
        </div>

        <footer className="text-center mt-12 py-6 border-t border-white/10">
            <p className="text-gray-500">
                Criado com base na metodologia de <a href="https://www.instagram.com/ofelipescher/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:underline">Dr. Felipe Scher</a>.
            </p>
        </footer>
      </main>
    </div>
  );
};

export default App;