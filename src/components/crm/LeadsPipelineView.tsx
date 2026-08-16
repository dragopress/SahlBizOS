import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Opportunity, OpportunityStage } from '../../types';
import { Plus, ArrowRight } from 'lucide-react';
import { formatMAD } from '../../utils/formatters';

const STAGES: { id: OpportunityStage; title: string }[] = [
  { id: 'lead', title: 'Lead / Prospect' },
  { id: 'qualified', title: 'Qualifié' },
  { id: 'proposal', title: 'Proposition / Devis' },
  { id: 'negotiation', title: 'Négociation' },
  { id: 'won', title: 'Gagné (Won)' },
];

export const LeadsPipelineView: React.FC = () => {
  const { opportunities, updateOpportunity, setActiveModal, language, t } = useApp();

  const totalPipelineRevenue = opportunities
    .filter((o) => o.stage !== 'lost')
    .reduce((acc, o) => acc + o.expectedRevenueMAD, 0);

  const handleAdvanceStage = (opp: Opportunity) => {
    const stageOrder: OpportunityStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won'];
    const currentIndex = stageOrder.indexOf(opp.stage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      updateOpportunity(opp.id, { stage: nextStage });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">
            Revenue Pipeline
          </span>
          <h2 className="text-2xl lg:text-3xl font-serif italic text-white leading-tight mt-0.5">
            {t.leadsPipeline}
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            {language === 'ar'
              ? 'متابعة مسار الصفقات التجارية، التوقعات المالية ونسب إغلاق المبيعات'
              : 'Pipeline des opportunités d’affaires, probabilités de clôture et prévisions commerciales.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded bg-[#0C0C0C] border border-white/10 text-xs font-mono">
            <span className="text-zinc-500 mr-1.5 uppercase tracking-wider text-[10px]">{language === 'ar' ? 'القيمة الإجمالية:' : 'Total Pipeline:'}</span>
            <span className="text-emerald-400 font-bold">{formatMAD(totalPipelineRevenue, language)}</span>
          </div>

          <button
            onClick={() => setActiveModal('new_opportunity')}
            className="flex items-center gap-2 px-4 py-2 rounded bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'فرصة جديدة' : 'Nouvelle Opportunité'}</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colOpps = opportunities.filter((o) => o.stage === col.id);
          const colTotal = colOpps.reduce((acc, o) => acc + o.expectedRevenueMAD, 0);

          return (
            <div
              key={col.id}
              className="flex flex-col bg-[#0C0C0C] border border-white/10 rounded-lg p-3 min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <div>
                  <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                    {col.title}
                  </h4>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {formatMAD(colTotal, language)}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-zinc-400">
                  {colOpps.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="p-3.5 rounded bg-[#080808] border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                        {opp.probabilityPercent}% prob.
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{opp.expectedCloseDate}</span>
                    </div>

                    <h5 className="font-medium text-xs text-white group-hover:text-zinc-200 transition-colors">
                      {opp.title}
                    </h5>

                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {opp.customerName}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 text-xs font-mono">
                      <span className="font-bold text-emerald-400">
                        {formatMAD(opp.expectedRevenueMAD, language)}
                      </span>

                      {col.id !== 'won' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdvanceStage(opp);
                          }}
                          title="Avancer à l'étape suivante"
                          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-0.5 text-[10px] font-mono uppercase"
                        >
                          <span>Suivant</span>
                          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colOpps.length === 0 && (
                  <div className="h-32 flex items-center justify-center border border-dashed border-white/10 rounded text-zinc-600 text-xs font-mono">
                    {language === 'ar' ? 'لا توجد صفقات' : 'Aucune opportunité'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
