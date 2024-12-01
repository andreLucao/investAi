'use client';

import { useState } from 'react';

export default function BelvoIntegration() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBelvoRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/belvo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to connect to Belvo API');
      }

      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '8px', 
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ marginTop: 0 }}>Open Finance Integration</h1>
        
        <button
          onClick={handleBelvoRequest}
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            background: loading ? '#93c5fd' : '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '16px'
          }}
        >
          {loading ? 'Connecting...' : 'Connect Bank Account'}
        </button>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #ef4444',
            padding: '12px',
            borderRadius: '6px',
            marginTop: '16px'
          }}>
            <h4 style={{ color: '#dc2626', margin: '0 0 8px 0' }}>Error</h4>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {response && (
          <div style={{ marginTop: '24px' }}>
            <h3>Connection Status</h3>
            <div style={{
              background: '#f0fdf4',
              padding: '16px',
              borderRadius: '6px',
              marginTop: '8px'
            }}>
              <p><strong>Link ID:</strong> {response.link?.id || 'N/A'}</p>
              <p><strong>Status:</strong> {response.link?.status || 'N/A'}</p>
            </div>

            {response.balances?.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <h3>Account Balances</h3>
                <div style={{
                  display: 'grid',
                  gap: '16px',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  marginTop: '16px'
                }}>
                  {response.balances.map((balance, index) => (
                    <div key={index} style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '6px'
                    }}>
                      <p><strong>Account:</strong> {balance.account?.number || 'N/A'}</p>
                      <p><strong>Balance:</strong> {balance.balance} {balance.currency}</p>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>
                        Updated: {new Date(balance.collected_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}