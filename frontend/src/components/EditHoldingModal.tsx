import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Edit2, AlertCircle } from 'lucide-react';

interface EditHoldingModalProps {
  holding: {
    id: number;
    coin_id: string;
    symbol: string;
    amount: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const EditHoldingModal: React.FC<EditHoldingModalProps> = ({ holding, onClose, onSuccess }) => {
  const { authFetch, showToast } = useAuth();
  
  const [amount, setAmount] = useState(holding.amount.toString());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Amount must be a number greater than 0.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await authFetch(`/portfolio/${holding.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          amount: numAmount,
        }),
      });

      if (res.ok) {
        showToast('Holding updated successfully!');
        onSuccess();
        onClose();
      } else {
        const errData = await res.json();
        setError(errData.detail || 'Failed to update holding.');
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
            <Edit2 size={20} className="logo-icon" /> Edit {holding.symbol} Balance
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

          <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border-color)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Adjusting holdings for <span className="text-bold" style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{holding.coin_id}</span> ({holding.symbol.toUpperCase()}).
          </div>

          <div className="form-group">
            <label className="form-label">New Amount Held</label>
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
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
