import React from 'react';
import { Wallet } from 'lucide-react';

const BudgetOverview = ({ 
  totalAmount = 2450, 
  lodgingPct = 45, 
  foodPct = 30, 
  transportPct = 25, 
  activitiesPct = 0,
  onDetailClick 
}) => {
  // Format total as currency
  const formattedTotal = `$${totalAmount.toLocaleString()}`;

  // Calculate conic gradient angles based on dynamic percentages
  const p1 = lodgingPct;
  const p2 = p1 + foodPct;
  const p3 = p2 + transportPct;

  const gradientStyle = totalAmount > 0 ? {
    background: `conic-gradient(
      #009688 0% ${p1}%,
      #14b8a6 ${p1}% ${p2}%,
      #94a3b8 ${p2}% ${p3}%,
      #f59e0b ${p3}% 100%
    )`
  } : {
    background: '#1a1c2a'
  };

  return (
    <div className="bg-[#141622] border border-white/10 rounded-2xl p-5 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#14b8a6]">
            <Wallet size={16} />
          </span>
          <h3 className="text-base font-serif font-bold text-white tracking-tight">
            Budget Overview
          </h3>
        </div>
        <span className="text-[10px] text-teal-400 font-mono bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
          Dynamic
        </span>
      </div>

      {/* Donut Chart Display */}
      <div className="flex justify-center py-2">
        <div 
          className="w-36 h-36 rounded-full p-3.5 flex items-center justify-center relative shadow-inner transition-all duration-700"
          style={gradientStyle}
        >
          {/* Inner Circle cutout */}
          <div className="w-full h-full bg-[#141622] rounded-full flex flex-col items-center justify-center p-2 text-center border border-white/10 shadow-xl">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              TOTAL
            </span>
            <span className="text-xl font-bold font-mono text-white tracking-tight">
              {formattedTotal}
            </span>
          </div>
        </div>
      </div>

      {/* Expense Breakdown List */}
      <div className="space-y-2 text-xs text-gray-300 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#009688]"></span>
            <span>Lodging</span>
          </div>
          <span className="font-semibold text-white font-mono">{lodgingPct}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]"></span>
            <span>Food & Dining</span>
          </div>
          <span className="font-semibold text-white font-mono">{foodPct}%</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span>
            <span>Transport</span>
          </div>
          <span className="font-semibold text-white font-mono">{transportPct}%</span>
        </div>

        {activitiesPct > 0 && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
              <span>Activities & Tours</span>
            </div>
            <span className="font-semibold text-white font-mono">{activitiesPct}%</span>
          </div>
        )}
      </div>

      {/* View Details Button */}
      <button
        onClick={onDetailClick}
        className="w-full bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 hover:text-white py-2.5 px-4 rounded-xl text-xs font-medium transition text-center cursor-pointer"
      >
        View Detailed Breakdown
      </button>
    </div>
  );
};

export default BudgetOverview;
