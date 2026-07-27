import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Holding {
  id: number;
  coin_id: string;
  symbol: string;
  amount: number;
}

interface AiInsightsProps {
  holdings: Holding[];
  prices: Record<string, number>;
}

export const AiInsights: React.FC<AiInsightsProps> = ({ holdings, prices }) => {
  const getInsights = () => {
    const list: Array<{
      id: string;
      title: string;
      text: string;
      type: 'info' | 'warning' | 'success';
    }> = [];

    if (holdings.length === 0) {
      list.push({
        id: 'no-assets',
        title: 'Empty Portfolio',
        text: 'CoinFlow is ready! Use the "Add Holding" button above to log your assets and see live performance insights here.',
        type: 'info',
      });
      return list;
    }

    // Calculate total portfolio value and individual holdings values
    let totalValue = 0;
    const holdingValues = holdings.map((h) => {
      const price = prices[h.coin_id] || 0;
      const val = h.amount * price;
      totalValue += val;
      return { ...h, val };
    });

    // 1. Diversification Advisor
    const highConcentration = holdingValues.find((h) => totalValue > 0 && (h.val / totalValue) > 0.6);
    if (highConcentration) {
      list.push({
        id: 'concentration',
        title: 'Concentration Warning',
        text: `Your ${highConcentration.symbol.toUpperCase()} holdings make up over ${( (highConcentration.val / totalValue) * 100 ).toFixed(1)}% of your portfolio. Consider diversifying to reduce volatility exposure.`,
        type: 'warning',
      });
    } else if (holdings.length >= 3) {
      list.push({
        id: 'diversified',
        title: 'Healthy Diversification',
        text: 'Nice distribution! Your portfolio spans multiple assets, keeping single-asset volatility risks optimized.',
        type: 'success',
      });
    }

    // 2. Wallet Security recommendations
    if (totalValue > 5000) {
      list.push({
        id: 'hardware-wallet',
        title: 'Cold Storage Recommendation',
        text: `Your aggregate balance is substantial ($${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}). If you haven't already, transfer assets from exchange accounts to a hardware/cold wallet.`,
        type: 'warning',
      });
    } else {
      list.push({
        id: 'wallet-safety',
        title: 'Wallet Addresses Logged',
        text: 'Always double-check recipient address networks before making blockchain transfers. Copy-pasting addresses is highly recommended.',
        type: 'info',
      });
    }

    // 3. AI Crypto Sentiment Tip
    const hasSol = holdings.some(h => h.coin_id === 'solana');
    const hasEth = holdings.some(h => h.coin_id === 'ethereum');
    if (!hasEth && !hasSol) {
      list.push({
        id: 'smart-contracts',
        title: 'Smart Contract Platforms',
        text: 'Your current asset mix lacks smart contract platform exposure (like Ethereum or Solana). These networks drive DeFi and NFT utilities.',
        type: 'info',
      });
    }

    return list;
  };

  const insights = getInsights();

  return (
    <div className="panel glass-panel" style={{ height: 'auto' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <Sparkles size={18} className="logo-icon" style={{ color: 'var(--color-secondary)' }} />
          CoinFlow Insights
        </h2>
      </div>

      <div className="insights-list">
        {insights.map((insight) => {
          let Icon = Sparkles;
          let cardClass = 'insight-card';

          if (insight.type === 'warning') {
            Icon = AlertTriangle;
            cardClass += ' warning';
          } else if (insight.type === 'success') {
            Icon = CheckCircle2;
            cardClass += ' success';
          }

          return (
            <div key={insight.id} className={cardClass}>
              <div className={`insight-card-header ${insight.type === 'warning' ? 'warning' : insight.type === 'success' ? 'success' : ''}`}>
                <Icon size={16} />
                <span>{insight.title}</span>
              </div>
              <p className="insight-text">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
