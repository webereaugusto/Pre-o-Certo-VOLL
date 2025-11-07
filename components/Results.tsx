
import React, { ChangeEvent, useState } from 'react';
import { CalculatedResults, SimulationResults } from '../types';
import { InfoIcon, DownloadIcon } from './icons';

declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

interface ResultsProps {
  results: CalculatedResults;
  simulatedPackages: CalculatedResults['packages'];
  handlePackageChange: (key: keyof CalculatedResults['packages'], value: string) => void;
  simulationResults: SimulationResults;
  competitorPrice: number;
}

const formatCurrency = (value: number) => {
  if (isNaN(value) || !isFinite(value)) {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ResultItem: React.FC<{ label: string; value: string; tooltip?: string, isLarge?: boolean }> = ({ label, value, tooltip, isLarge = false }) => (
  <div className={`flex justify-between items-center py-3 border-b border-white/10 ${isLarge ? 'flex-col items-start' : ''}`}>
    <p className={`flex items-center ${isLarge ? 'text-lg text-gray-300 mb-1' : 'text-gray-400'}`}>
        {label}
         {tooltip && (
          <span className="ml-2 group relative">
            <InfoIcon className="w-4 h-4 text-gray-500" />
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {tooltip}
            </span>
          </span>
        )}
    </p>
    <p className={`${isLarge ? 'text-4xl text-teal-300' : 'text-lg text-white'} font-bold`}>{value}</p>
  </div>
);

interface PackageCardProps {
    frequency: string;
    sessions: string;
    price: number;
    packageKey: keyof CalculatedResults['packages'];
    onPriceChange: (key: keyof CalculatedResults['packages'], value: string) => void;
    competitorPrice?: number;
    idealPrice?: number;
    isExporting?: boolean;
}

const CompetitorAnalysis: React.FC<{ idealPrice: number, competitorPrice: number }> = ({ idealPrice, competitorPrice }) => {
    if (competitorPrice <= 0) return null;

    const difference = ((idealPrice / competitorPrice) - 1) * 100;
    const absDifference = Math.abs(difference).toFixed(0);

    let text, colorClass;
    if (difference > 5) {
        text = `${absDifference}% acima da média`;
        colorClass = 'text-yellow-400';
    } else if (difference < -5) {
        text = `${absDifference}% abaixo da média`;
        colorClass = 'text-green-400';
    } else {
        text = 'Preço competitivo';
        colorClass = 'text-cyan-400';
    }

    return (
        <p className={`text-xs mt-2 font-semibold ${colorClass}`}>
            {text}
        </p>
    );
}

const PackageCard: React.FC<PackageCardProps> = ({ frequency, sessions, price, packageKey, onPriceChange, competitorPrice, idealPrice, isExporting }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg text-center border border-gray-700 flex-1 flex flex-col justify-between">
        <div>
            <h4 className="font-bold text-teal-400">{frequency}</h4>
            <p className="text-sm text-gray-400">{sessions}</p>
            <div className="relative mt-2">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">R$</span>
                {isExporting ? (
                    <div className="w-full bg-gray-800/60 border border-gray-600 rounded-md py-2 pl-9 pr-2 text-white text-center text-2xl font-bold">
                        {Math.round(price)}
                    </div>
                ) : (
                    <input
                        type="number"
                        value={Math.round(price) === 0 ? '' : Math.round(price)}
                        onChange={(e) => onPriceChange(packageKey, e.target.value)}
                        className="w-full bg-gray-800/60 border border-gray-600 rounded-md py-2 pl-9 pr-2 text-white text-center text-2xl font-bold focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                )}
            </div>
        </div>
        {competitorPrice && idealPrice && (
            <CompetitorAnalysis idealPrice={idealPrice} competitorPrice={competitorPrice} />
        )}
    </div>
);


const Results: React.FC<ResultsProps> = ({ results, simulatedPackages, handlePackageChange, simulationResults, competitorPrice }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    const resultsElement = document.getElementById('results-to-export');
    if (!resultsElement) return;

    setIsExporting(true);

    // Allow React to re-render with the inputs replaced by divs
    setTimeout(() => {
        const { html2canvas } = window;
        const { jsPDF } = window.jspdf;
        
        if (!html2canvas || !jsPDF) {
            console.error("PDF generation libraries not loaded.");
            alert("Erro ao exportar PDF. Tente recarregar a página.");
            setIsExporting(false);
            return;
        }

        const originalBackgroundColor = resultsElement.style.backgroundColor;
        resultsElement.style.backgroundColor = '#111827';

        html2canvas(resultsElement, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#111827'
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
          });
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const imgProps = pdf.getImageProperties(imgData);
          const imgWidth = imgProps.width;
          const imgHeight = imgProps.height;
          
          const ratio = imgWidth / imgHeight;
          
          let finalWidth = pdfWidth - 20;
          let finalHeight = finalWidth / ratio;
          
          if (finalHeight > pdfHeight - 20) {
            finalHeight = pdfHeight - 20;
            finalWidth = finalHeight * ratio;
          }
          
          const xOffset = (pdfWidth - finalWidth) / 2;
          const yOffset = 10;
          
          pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
          pdf.save('precificacao-pci.pdf');
        }).catch(error => {
            console.error("Error generating PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF.");
        }).finally(() => {
            resultsElement.style.backgroundColor = originalBackgroundColor;
            setIsExporting(false);
        });
    }, 100);
  };

  if (!results.isValid) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-teal-300 mb-4">Resultados</h2>
        <p className="text-gray-300">Preencha os campos ao lado para calcular sua precificação.</p>
        <p className="text-yellow-400 mt-4 text-sm">Dica: Custos variáveis e lucro não podem somar 100% ou mais.</p>
      </div>
    );
  }
    
  return (
    <div id="results-to-export" className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-teal-300">Resultados da Precificação</h2>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-teal-600/50 border border-teal-500 rounded-lg text-teal-200 hover:bg-teal-600/80 transition-colors disabled:opacity-50 disabled:cursor-wait"
                title="Exportar como PDF"
              >
                  <DownloadIcon className="w-4 h-4" />
                  <span>{isExporting ? 'Exportando...' : 'Exportar PDF'}</span>
              </button>
            </div>
            
            <ResultItem label="Preço por Atendimento (Ideal)" value={formatCurrency(results.pricePerSession)} isLarge tooltip="Este é o preço mínimo que você deve cobrar por sessão para atingir suas metas."/>

            <div className="my-6">
                 <h3 className="text-lg font-semibold text-white mb-3">Pacotes Mensais (Simulador)</h3>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <PackageCard frequency="1x por semana" sessions="~5 atend./mês" price={simulatedPackages['1x']} packageKey="1x" onPriceChange={handlePackageChange} isExporting={isExporting} />
                    <PackageCard frequency="2x por semana" sessions="~9 atend./mês" price={simulatedPackages['2x']} packageKey="2x" onPriceChange={handlePackageChange} competitorPrice={competitorPrice} idealPrice={results.packages['2x']} isExporting={isExporting} />
                    <PackageCard frequency="3x por semana" sessions="~13 atend./mês" price={simulatedPackages['3x']} packageKey="3x" onPriceChange={handlePackageChange} isExporting={isExporting} />
                 </div>
                 <p className="text-xs text-gray-500 mt-2 text-center">Altere os valores acima para simular seu lucro.</p>
            </div>
            
            {simulationResults.isSimulating && (
                <div className="my-6 p-4 rounded-lg bg-teal-900/30 border border-teal-500/30">
                    <h3 className="text-lg font-semibold text-teal-300 mb-3">Análise de Cenário</h3>
                    <ResultItem label="Novo Faturamento Total" value={formatCurrency(simulationResults.newRevenue)} tooltip="Estimativa de faturamento com os novos preços de pacotes." />
                    <ResultItem label="Novo Lucro (R$)" value={formatCurrency(simulationResults.newProfitValue)} tooltip="Lucro líquido estimado após subtrair todos os custos (fixos e variáveis)." />
                    <ResultItem label="Nova Margem de Lucro (%)" value={`${simulationResults.newProfitMargin.toFixed(2)}%`} tooltip="Percentual do faturamento que se transforma em lucro." />
                </div>
            )}
            
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Ponto de Equilíbrio</h3>
                <ResultItem label="Faturamento para 'empatar'" value={formatCurrency(results.breakEven.monthlyRevenue)} tooltip="Faturamento mínimo para cobrir todos os custos fixos e variáveis, sem lucro."/>
                <ResultItem label="Atendimentos para 'empatar'" value={`${Math.ceil(results.breakEven.sessionsPerMonth)}/mês`} tooltip="Número de atendimentos necessários no mês para atingir o faturamento de equilíbrio."/>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Reserva de Emergência</h3>
                <ResultItem label="Total para 6 meses" value={formatCurrency(results.emergencyReserve.totalNeeded)} tooltip="Valor total necessário para cobrir 6 meses de custos fixos sem nenhuma entrada de faturamento."/>
                <ResultItem label="Economia mensal (meta 12 meses)" value={`${formatCurrency(results.emergencyReserve.monthlySaving12Months)}/mês`} tooltip="Valor que você precisa guardar mensalmente para construir sua reserva de emergência em 1 ano."/>
                <ResultItem label="Economia mensal (meta 24 meses)" value={`${formatCurrency(results.emergencyReserve.monthlySaving24Months)}/mês`} tooltip="Valor que você precisa guardar mensalmente para construir sua reserva de emergência em 2 anos."/>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Metas e Detalhes (Baseado no cálculo ideal)</h3>
                <ResultItem label="Faturamento Mínimo Necessário" value={formatCurrency(results.targetRevenue)} tooltip="Valor total que sua empresa precisa faturar no mês para cobrir todos os custos e atingir a meta de lucro."/>
                <ResultItem label="Total de Custos Fixos" value={formatCurrency(results.totalFixedCosts)} />
                <ResultItem label="Atendimentos (Ocupação Real)" value={`${Math.round(results.realSessionsPerMonth)}/mês`} />
                <ResultItem label="Clientes Ativos (equivalente 2x/sem)" value={`~ ${Math.round(results.equivalentClients2x)} clientes`} tooltip="Estimativa de quantos clientes ativos no plano 2x/semana você teria, com base no total de atendimentos mensais."/>
            </div>

             <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Pirâmide Financeira (Baseado no faturamento ideal)</h3>
                <ResultItem label="Folha Salarial (40%)" value={formatCurrency(results.financialPlanning.payroll)} tooltip="Verba destinada ao pagamento de todos os profissionais, incluindo encargos." />
                <ResultItem label="Custo Operacional (30%)" value={formatCurrency(results.financialPlanning.operational)} tooltip="Inclui seus custos fixos como aluguel, luz, marketing, etc." />
                <ResultItem label="Reserva da Empresa (20%)" value={formatCurrency(results.financialPlanning.reserve)} tooltip="Seu lucro. Usado para reinvestimentos, emergências e crescimento." />
                <ResultItem label="Capital de Giro (10%)" value={formatCurrency(results.financialPlanning.workingCapital)} tooltip="Dinheiro para manter a operação funcionando no dia a dia." />
            </div>
        </div>
    </div>
  );
};

export default Results;
