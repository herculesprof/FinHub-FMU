import React from 'react';
import { EnrichedTransaction } from '../types';
import { TrendingDown, TrendingUp, MoreHorizontal } from 'lucide-react';

interface Props {
  data: EnrichedTransaction;
}

export const TransactionCard: React.FC<Props> = ({ data }) => {
  const isCredit = data.type === 'credit';

  // Helper to color code sentiments
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'essencial': return 'bg-blue-100 text-blue-700';
      case 'supérfluo': return 'bg-orange-100 text-orange-700';
      case 'positivo': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md active:scale-[0.99]">
      {/* Icon / Emoji Container */}
      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
        {data.emoji}
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate pr-2">
            {data.cleanName}
          </h3>
          <span className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
            {isCredit ? '+' : ''} R$ {Math.abs(data.value).toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        <p className="text-xs text-gray-400 truncate mb-1">
          {data.rawDescription}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] uppercase tracking-wide text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
            {data.category}
          </span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getSentimentColor(data.sentiment)}`}>
            {data.sentiment}
          </span>
        </div>
      </div>
    </div>
  );
};