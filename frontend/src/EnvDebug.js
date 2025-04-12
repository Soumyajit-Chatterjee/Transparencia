import React from 'react';

export default function EnvDebug() {
    return (
        <div style={{
            background: '#f0f0f0',
            padding: '20px',
            margin: '20px',
            borderRadius: '5px'
        }}>
            <h3>Environment Debug</h3>
            <p><strong>Contract Address:</strong> {process.env.REACT_APP_CONTRACT_ADDRESS || 'NOT SET'}</p>
            <p><strong>Alchemy URL:</strong> {process.env.REACT_APP_ALCHEMY_API_URL ? 'SET' : 'NOT SET'}</p>
        </div>
    );
}