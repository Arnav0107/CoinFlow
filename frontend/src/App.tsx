import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthScreen } from './components/AuthScreen';
import { AddHoldingModal } from './components/AddHoldingModal';
import { EditHoldingModal } from './components/EditHoldingModal';
import { AiInsights } from './components/AiInsights';
import { fetchLivePrices } from './services/coinGecko';
import { 
  Coins, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Wallet, 
  TrendingUp, 
  Copy, 
  RefreshCw, 
  User, 
  ShieldCheck, 
  Server
} from 'lucide-react';

interface Holding {
  id: number;
  coin_id: string;
  symbol: string;
  amount: number;
  wallet_address: string | null;
  created_at: string;
}

export const App: React.FC = () => {
  const { user, loading, logout, authFetch, toasts, showToast } = useAuth();
  
  // Dashboard states
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [fetchingHoldings, setFetchingHoldings] = useState(false);
  const [fetchingPrices, setFetchingPrices] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null);

  // Fetch holdings
  useEffect(() => {
    if (!user) return;

    const loadHoldings = async () => {
      setFetchingHoldings(true);
      try {
        const res = await authFetch('/portfolio/');
        if (res.ok) {
          const data = await res.json();
          setHoldings(data);
        }
      } catch (err) {
        console.error('Failed to load portfolio holdings', err);
      } finally {
        setFetchingHoldings(false);
      }
    };

    loadHoldings();
  }, [user, refreshKey]);

  // Fetch prices when holdings change
  useEffect(() => {
    if (holdings.length === 0) {
      setPrices({});
      return;
    }

    const loadPrices = async () => {
      setFetchingPrices(true);
      try {
        const coinIds = holdings.map((h) => h.coin_id);
        const data = await fetchLivePrices(coinIds);
        setPrices(data);
      } catch (err) {
        console.error('Failed to sync live rates', err);
      } finally {
        setFetchingPrices(false);
      }
    };

    loadPrices();
  }, [holdings]);

  // Copy address to clipboard
  const handleCopyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    showToast('Wallet address copied to clipboard!');
  };

  // Delete holding action
  const handleDeleteHolding = async (id: number, symbol: string) => {
    if (!confirm(`Are you sure you want to remove your ${symbol.toUpperCase()} holdings?`)) {
      return;
    }

    try {
      const res = await authFetch(`/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (res.status === 204 || res.ok) {
        showToast(`${symbol.toUpperCase()} holding removed.`);
        setRefreshKey((prev) => prev + 1);
      } else {
        showToast('Failed to delete holding.', 'error');
      }
    } catch (err) {
      showToast('Connection to server failed.', 'error');
    }
  };

  // Calculate Net Worth
  const getNetWorth = () => {
    return holdings.reduce((sum, h) => {
      const price = prices[h.coin_id] || 0;
      return sum + h.amount * price;
    }, 0);
  };

  // Loading Screen
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', background: '#0a0b10' }}>
        <RefreshCw className="logo-icon" size={32} style={{ animation: 'spin 1.5s linear infinite' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Synchronizing secure sessions...</span>
      </div>
    );
  }

  // Auth Screen if not logged in
  if (!user) {
    return (
      <>
        <AuthScreen />
        {/* Toast Notifications */}
        <div className="notification-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>
              <span>{toast.text}</span>
            </div>
          ))}
        </div>
      </>
    );
  }

  const netWorth = getNetWorth();

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* App Header */}
      <header className="app-header">
        <div className="logo-container">
          <Coins className="logo-icon" size={24} />
          <span>CoinFlow</span>
        </div>
        
        <div className="user-nav">
          <div className="user-badge">
            <User size={14} style={{ color: 'var(--color-primary)' }} />
            <span>{user.username}</span>
          </div>
          <button className="btn btn-secondary" onClick={logout} style={{ padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="dashboard-container">
        
        {/* Actions Bar */}
        <div className="dashboard-actions-header">
          <div className="dashboard-title-area">
            <h1>Workspace Terminal</h1>
            <p>Real-time analytics and intelligent coin optimization.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              disabled={fetchingHoldings || fetchingPrices}
            >
              <RefreshCw 
                size={16} 
                style={{ animation: fetchingHoldings || fetchingPrices ? 'spin 1.5s linear infinite' : 'none' }} 
              />
              Sync Rates
            </button>
            <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
              <Plus size={16} /> Add Holding
            </button>
          </div>
        </div>

        {/* Aggregate Cards */}
        <div className="summary-grid">
          <div className="glass-panel summary-card">
            <div className="summary-details">
              <h3>Net Worth</h3>
              <div className="summary-value">
                ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="summary-subtext positive">
                <TrendingUp size={12} /> Real-time USD Value
              </div>
            </div>
            <div className="summary-icon-container success">
              <Wallet size={22} />
            </div>
          </div>

          <div className="glass-panel summary-card">
            <div className="summary-details">
              <h3>Tracked Assets</h3>
              <div className="summary-value">{holdings.length}</div>
              <div className="summary-subtext">
                Coins monitored in DB
              </div>
            </div>
            <div className="summary-icon-container primary">
              <Coins size={22} />
            </div>
          </div>

          <div className="glass-panel summary-card">
            <div className="summary-details">
              <h3>Server Status</h3>
              <div className="summary-value" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', display: 'inline-block' }}></span>
                <span>Connected</span>
              </div>
              <div className="summary-subtext">
                Port 8000 (Active)
              </div>
            </div>
            <div className="summary-icon-container">
              <Server size={22} style={{ color: 'var(--text-secondary)' }} />
            </div>
          </div>
        </div>

        {/* Content Section: Holdings & AI insights */}
        <div className="content-grid">
          
          {/* Holdings Panel */}
          <div className="glass-panel panel">
            <div className="panel-header">
              <h2 className="panel-title">
                <ShieldCheck size={18} className="logo-icon" /> Assets Balance
              </h2>
            </div>

            {fetchingHoldings && holdings.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                <RefreshCw size={24} style={{ animation: 'spin 1.5s linear infinite', color: 'var(--color-primary)' }} />
              </div>
            ) : holdings.length === 0 ? (
              <div className="empty-state">
                <Coins className="empty-state-icon" size={48} />
                <h3>No Assets Logged</h3>
                <p style={{ maxWidth: '320px', fontSize: '0.875rem' }}>
                  Begin building your portfolio tracking profile by adding your cryptocurrency balances.
                </p>
                <button className="btn btn-primary" onClick={() => setIsAddOpen(true)} style={{ marginTop: '0.5rem' }}>
                  <Plus size={16} /> Add First Asset
                </button>
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Balance</th>
                      <th>Price</th>
                      <th>Value</th>
                      <th>Wallet</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h) => {
                      const price = prices[h.coin_id] || 0;
                      const value = h.amount * price;
                      
                      return (
                        <tr key={h.id}>
                          <td>
                            <div className="coin-info-cell">
                              <div className="coin-avatar">
                                {h.symbol.substring(0, 2)}
                              </div>
                              <div className="coin-details">
                                <span className="coin-name">{h.coin_id}</span>
                                <span className="coin-symbol">{h.symbol}</span>
                              </div>
                            </div>
                          </td>
                          <td className="text-bold">
                            {h.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                          </td>
                          <td>
                            {price > 0 
                              ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}` 
                              : <span style={{ color: 'var(--text-muted)' }}>Syncing...</span>
                            }
                          </td>
                          <td className="text-bold" style={{ color: 'var(--text-primary)' }}>
                            {price > 0 
                              ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                              : <span style={{ color: 'var(--text-muted)' }}>Syncing...</span>
                            }
                          </td>
                          <td>
                            {h.wallet_address ? (
                              <button 
                                className="wallet-badge" 
                                title="Click to copy wallet address"
                                onClick={() => handleCopyAddress(h.wallet_address!)}
                              >
                                <Wallet size={12} />
                                <span>
                                  {h.wallet_address.substring(0, 6)}...{h.wallet_address.substring(h.wallet_address.length - 4)}
                                </span>
                                <Copy size={10} />
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>No wallet</span>
                            )}
                          </td>
                          <td>
                            <div className="actions-cell">
                              <button 
                                className="btn btn-secondary btn-icon-only" 
                                title="Edit amount"
                                onClick={() => setEditingHolding(h)}
                              >
                                <Edit2 size={14} />
                              </button>
                              <button 
                                className="btn btn-danger btn-icon-only" 
                                title="Delete Asset"
                                onClick={() => handleDeleteHolding(h.id, h.symbol)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* AI Insights Panel */}
          <div>
            <AiInsights holdings={holdings} prices={prices} />
          </div>

        </div>
      </main>

      {/* Modals & Popups */}
      {isAddOpen && (
        <AddHoldingModal 
          onClose={() => setIsAddOpen(false)} 
          onSuccess={() => setRefreshKey((prev) => prev + 1)} 
        />
      )}

      {editingHolding && (
        <EditHoldingModal
          holding={editingHolding}
          onClose={() => setEditingHolding(null)}
          onSuccess={() => setRefreshKey((prev) => prev + 1)}
        />
      )}

      {/* Global Toast Notifications */}
      <div className="notification-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type === 'error' ? 'error' : 'success'}`}>
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
export default App;
