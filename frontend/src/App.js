import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import OwnerPanel from './components/OwnerPanel';
import UserPanel from './components/UserPanel';
import './App.css';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS; // YOUR REACT APP CONTRACT ADDRESS

const ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "candidateId",
                "type": "uint256"
            }
        ],
        "name": "VoteCasted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "candidates",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "voteCount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "candidatesCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voters",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_candidateId",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

function App() {
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [status, setStatus] = useState('Connecting to blockchain...');

    useEffect(() => {
        const initializeApp = async () => {
            try {
                if (!window.ethereum) throw new Error('MetaMask not detected');

                setStatus('Connecting to wallet...');
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });
                setAccount(accounts[0]);

                setStatus('Loading contract...');
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

                const owner = await contract.owner();
                setIsOwner(accounts[0].toLowerCase() === owner.toLowerCase());

                setContract(contract);
                setStatus('connected');
            } catch (error) {
                setStatus(`error: ${error.message}`);
            }
        };

        initializeApp();

        const handleAccountsChanged = (accounts) => {
            if (accounts.length > 0) setAccount(accounts[0]);
            else setStatus('error: Please connect your wallet');
        };

        window.ethereum.on('accountsChanged', handleAccountsChanged);
        return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    }, []);

    if (status.startsWith('error')) {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="error-screen">
                        <h2>Connection Error</h2>
                        <p>{status.replace('error: ', '')}</p>
                        <div className="debug-info">
                            <p>Contract: {CONTRACT_ADDRESS}</p>
                            <p>Network: Sepolia (ChainID 11155111)</p>
                        </div>
                        <button className="retry-button" onClick={() => window.location.reload()}>
                            Retry Connection
                        </button>
                    </div>
                </header>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="loading-screen">
                        <div className="connection-spinner"></div>
                        <p>{status}</p>
                    </div>
                </header>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="contract-container">
                    {isOwner ? (
                        <OwnerPanel contract={contract} account={account} />
                    ) : (
                        <UserPanel contract={contract} account={account} />
                    )}
                </div>
            </header>
        </div>
    );
}

export default App;