import React, { useState, useEffect, useCallback } from 'react';

const UserPanel = ({ contract, account }) => {
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCandidates = useCallback(async () => {
        if (!contract) return;
        setIsLoading(true);
        try {
            const count = await contract.candidatesCount();
            const fetched = [];
            for (let i = 1; i <= count; i++) {
                fetched.push(await contract.candidates(i));
            }
            setCandidates(fetched);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    }, [contract]);

    useEffect(() => {
        fetchCandidates();
    }, [fetchCandidates]);

    const vote = async (candidateId) => {
        setIsLoading(true);
        try {
            const tx = await contract.vote(candidateId);
            await tx.wait();
            await fetchCandidates();
        } catch (error) {
            console.error("Vote error:", error);
            alert(`Error: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Voting Panel</h1>
            <p>Connected Account: {account}</p>

            <h2>Candidates</h2>
            {isLoading && candidates.length === 0 ? (
                <p>Loading candidates...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {candidates.map((c) => (
                        <li key={c.id} style={{ margin: '10px 0' }}>
                            <strong>{c.name}</strong> (Votes: {c.voteCount.toString()})
                            <button
                                onClick={() => vote(c.id)}
                                disabled={isLoading}
                                style={{ marginLeft: '10px' }}
                            >
                                {isLoading ? "Processing..." : "Vote"}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserPanel;