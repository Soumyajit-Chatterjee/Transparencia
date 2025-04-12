// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Transparencia is Ownable {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // State variables
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public voters;
    uint public candidatesCount;
    bool public votingActive;

    // Events
    event VoteCasted(uint indexed candidateId);
    event CandidateAdded(uint indexed candidateId, string name);
    event VotingStatusChanged(bool active);

    constructor() Ownable(msg.sender) {
        votingActive = true; // Voting enabled by default
    }

    // Modifier to check voting status
    modifier onlyWhenActive() {
        require(votingActive, "Voting is currently closed");
        _;
    }

    // Owner functions
    function addCandidate(string memory _name) public onlyOwner {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        emit CandidateAdded(candidatesCount, _name);
    }

    function toggleVoting(bool _status) public onlyOwner {
        votingActive = _status;
        emit VotingStatusChanged(_status);
    }

    // Voting function
    function vote(uint _candidateId) public onlyWhenActive {
        require(!voters[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate");

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit VoteCasted(_candidateId);
    }

    // Helper view functions
    function getCandidate(uint _id) public view returns (Candidate memory) {
        return candidates[_id];
    }

    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }
}