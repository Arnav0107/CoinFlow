import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddHoldingModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const POPULAR_COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'ripple', symbol: 'XRP', name: 'Ripple' },
];

export const AddHoldingModal: React.FC<AddHoldingModalProps> = ({ onClose, onSuccess }) => {
  const { authFetch, showToast } = useAuth();
  
  const [selectedPreset, setSelectedPreset] = useState(POPULAR_COINS[0].id);
  const [isCustom, setIsCustom] = useState(false);
  const [customCoinId, setCustomCoinId] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');
  
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPreset(val);
    if (val === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let coin_id = '';
    let symbol = '';

    if (isCustom) {
      if (!customCoinId.trim()) {
        setError('Coin ID is required for custom coins.');
        return;
      }
      if (!customSymbol.trim()) {
        setError('Symbol is required for custom coins.');
        return;
      }
      coin_id = customCoinId.trim().toLowerCase();
      symbol = customSymbol.trim().toUpperCase();
    } else {
      const preset = POPULAR_COINS.find((c) => c.id === selectedPreset);
      if (!preset) return;
      coin_id = preset.id;
      symbol = preset.symbol;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch('/portfolio/', {
        method: 'POST',
        body: JSON.stringify({
          coin_id,
          symbol,
          amount: numAmount,
          wallet_address: walletAddress.trim() || null,
        }),
      });

      if (res.ok) {
        showToast('Asset added to portfolio!');
        onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Failed to add holding. Please check inputs.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay fade-in">
      <div className="modal-content glass-panel">
        <div className="modal-header">
          <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} className="logo-icon" /> Add New Holding
          </h2>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div className="form-error" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}>
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Asset Selection</label>
            <select
              className="form-control select-control"
              value={isCustom ? 'custom' : selectedPreset}
              onChange={handlePresetChange}
              disabled={submitting}
              style={{ paddingLeft: '1rem' }}
            >
              {POPULAR_COINS.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#12131a' }}>
                  {c.name} ({c.symbol})
                </option>
              ))}
              <option value="custom" style={{ background: '#12131a' }}>Custom Coin ID (CoinGecko compatible)</option>
            </select>
          </div>

          {isCustom && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CoinGecko ID</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. polkadot"
                  value={customCoinId}
                  onChange={(e) => setCustomCoinId(e.target.value)}
                  disabled={submitting}
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="form-group" style={{ width: '100px' }}>
                <label className="form-label">Symbol</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="DOT"
                  value={customSymbol}
                  onChange={(e) => setCustomSymbol(e.target.value)}
                  disabled={submitting}
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Amount Held</label>
            <input
              type="number"
              step="any"
              className="form-control"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={submitting}
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Wallet Address (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={submitting}
              style={{ paddingLeft: '1rem' }}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Adding...' : 'Add Holding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
