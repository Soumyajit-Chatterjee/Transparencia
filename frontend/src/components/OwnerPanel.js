import React, { useState, useEffect, useCallback } from 'react';

const OwnerPanel = ({ contract, account }) => {
    const [candidates, setCandidates] = useState([]);
    const [newCandidateName, setNewCandidateName] = useState("");
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

    const addCandidate = async () => {
        if (!newCandidateName.trim()) return alert("Please enter a valid name.");
        setIsLoading(true);
        try {
            const tx = await contract.addCandidate(newCandidateName);
            await tx.wait();
            setNewCandidateName("");
            await fetchCandidates();
        } catch (error) {
            console.error("Add error:", error);
            alert(`Error: ${error.reason || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Management Panel</h1>
            <p>Connected Account: {account}</p>

            <h2>Add Candidate</h2>
            <input
                type="text"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                placeholder="Candidate name"
                disabled={isLoading}
            />
            <button onClick={addCandidate} disabled={isLoading || !newCandidateName.trim()}>
                {isLoading ? "Processing..." : "Add Candidate"}
            </button>

            <h2>Candidates</h2>
            {isLoading && candidates.length === 0 ? (
                <p>Loading candidates...</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {candidates.map((c) => (
                        <li key={c.id} style={{ margin: '10px 0' }}>
                            <strong>{c.name}</strong> - Votes: {c.voteCount.toString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OwnerPanel;