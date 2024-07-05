import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import HealthcareWasteManagementABI from '../components/Healthcare_sol_Healthcare.abi'; 
import HealthcareWasteManagement from '../artifacts/Healthcare.json';

const WasteManagement = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [wasteDetails, setWasteDetails] = useState('');
  const [wasteIdToUpdate, setWasteIdToUpdate] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [wasteRecords, setWasteRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [showKnowMore, setShowKnowMore] = useState(false); // State for modal visibility

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Connect to Web3 provider (Remix VM sepolia fork)
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
  
        const web3 = window.web3;
  
        // Load contract ABI and address
        const deployedAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138'; 
        const contractInstance = new web3.eth.Contract(
          HealthcareWasteManagementABI,
          deployedAddress
        );
        setContract(contractInstance);
  
        // Get account address
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
  
        // Load initial waste records
        const initialRecords = await fetchInitialWasteRecords(contractInstance);
        setWasteRecords(initialRecords);
      } catch (error) {
        console.error('Error loading blockchain data:', error);
      }
    };
  
    loadBlockchainData();
  }, []);
  

  // Helper function to fetch initial waste records from the smart contract
  const fetchInitialWasteRecords = async (contract) => {
    const count = await contract.methods.getWasteCount().call();
    const records = [];
    for (let i = 1; i <= count; i++) {
      const record = await contract.methods.getWasteRecord(i).call();
      records.push({
        id: record[0],
        details: record[1],
        status: record[2],
        createdBy: record[3],
      });
    }
    return records;
  };

 
 // Event handler for creating a new waste record
const handleCreateWasteRecord = async (event) => {
  event.preventDefault();
  try {
    // Ensure contract is initialized and available
    if (!contract) {
      throw new Error('Contract instance not initialized.');
    }

    // Send transaction to create a new waste record
    await contract.methods.createWasteRecord(wasteDetails).send({ from: account });

    // Update UI with success message and clear form
    setMessage('Waste record created successfully!');
    setWasteDetails('');

    // Update waste records list
    const updatedRecords = await fetchInitialWasteRecords(contract);
    setWasteRecords(updatedRecords);
  } catch (error) {
    console.error('Error creating waste record:', error);
    setMessage(`Error: ${error.message}`);
  }
};


  // Event handler for updating waste status
const handleUpdateWasteStatus = async (event) => {
  event.preventDefault();
  try {
    // Ensure contract is initialized and available
    if (!contract) {
      throw new Error('Contract instance not initialized.');
    }

    // Mapping status to enum values defined in the contract
    const statusEnum = {
      created: 0,
      collected: 1,
      inTransit: 2,
      processed: 3,
    };

    // Send transaction to update waste status
    await contract.methods.updateWasteStatus(wasteIdToUpdate, statusEnum[newStatus.toLowerCase()]).send({ from: account });

    // Update UI with success message and clear form
    setMessage(`Waste status updated for ID ${wasteIdToUpdate}`);
    setWasteIdToUpdate('');
    setNewStatus('');

    // Update waste records list
    const updatedRecords = await fetchInitialWasteRecords(contract);
    setWasteRecords(updatedRecords);
  } catch (error) {
    console.error('Error updating waste status:', error);
    setMessage(`Error: ${error.message}`);
  }
};

  // Toggle function for showing/hiding Know More modal
  const toggleKnowMore = () => {
    setShowKnowMore(!showKnowMore);
  };

  return (
    <div className="container">
      
      <div className="section">
        <h2>Create Waste Record</h2>
        <form onSubmit={handleCreateWasteRecord}>
          <label>
            Details:
            <input type="text" value={wasteDetails} onChange={(e) => setWasteDetails(e.target.value)} required />
          </label>
          <button type="submit">Create Waste Record</button>
        </form>
      </div>
      <div className="section">
        <h2>Update Waste Status</h2>
        <form onSubmit={handleUpdateWasteStatus}>
          <label>
            Waste ID:
            <input type="number" value={wasteIdToUpdate} onChange={(e) => setWasteIdToUpdate(e.target.value)} required />
          </label>
          <label>
            New Status:
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} required>
              <option value="">Select Status</option>
              <option value="Created">Created</option>
              <option value="Collected">Collected</option>
              <option value="InTransit">In Transit</option>
              <option value="Processed">Processed</option>
            </select>
          </label>
          <button type="submit">Update Waste Status</button>
        </form>
      </div>
      <div className="section">
        <h2>Waste Records</h2>
        <ul>
          {wasteRecords.map((record) => (
            <li key={record.id}>
              <strong>ID:</strong> {record.id} <br />
              <strong>Details:</strong> {record.details} <br />
              <strong>Status:</strong> {record.status} <br />
              <strong>Created By:</strong> {record.createdBy}
            </li>
          ))}
        </ul>
      </div>
      <button className="button" onClick={toggleKnowMore}>Know More</button>
      {showKnowMore && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleKnowMore}>&times;</span>
            <h2>Know More About Waste Management</h2>
            <p>
              Hospital waste is categorized into different types such as general waste, infectious waste, hazardous waste, and more.
              Each type of waste is segregated and disposed of in specialized bins to ensure proper management and safety.
            </p>
            <p>
              Understanding these categories helps in maintaining hygiene standards and protecting the environment.
            </p>
          </div>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default WasteManagement;
