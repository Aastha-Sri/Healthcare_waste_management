// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract Healthcare {
    enum WasteStatus { Created, Collected, InTransit, Processed } //defines possible states of waste
    
    struct WasteRecord {
        uint id;                //fields of waste record
        string details;
        WasteStatus status;
        address createdBy;
    }

    mapping(uint => WasteRecord) private wasteRecords;//stores waste record mapped by their unique id
    uint private wasteCount; //tracks total number of waste records created

    // to log information from smart contract to ethereum blockchain

    event WasteCreated(uint indexed id, string details, address indexed createdBy);//Emitted when a new waste record is created.
    event WasteStatusUpdated(uint indexed id, WasteStatus status);//Emitted when the status of an existing waste record is updated.

    function createWasteRecord(string memory _details) public {
        require(bytes(_details).length > 0, "Details must not be empty"); //Requires that _details is not empty.
        wasteCount++;   //Increments wasteCount to generate a new ID.
        wasteRecords[wasteCount] = WasteRecord(wasteCount, _details, WasteStatus.Created, msg.sender); 
        //Creates a new WasteRecord with status Created , Stores the new record in wasteRecords

        emit WasteCreated(wasteCount, _details, msg.sender);
    }

    function updateWasteStatus(uint _id, WasteStatus _status) public {
        require(_id > 0 && _id <= wasteCount, "Invalid waste ID"); //Requires that _id is valid.
        WasteRecord storage waste = wasteRecords[_id];
        require(msg.sender == waste.createdBy, "Only the creator can update status"); //Requires that the caller is the creator of the waste record.
        waste.status = _status;
        emit WasteStatusUpdated(_id, _status);
    }

    function getWasteRecord(uint _id) public view returns (uint, string memory, WasteStatus, address) { //Retrieves the details of a waste record
        require(_id > 0 && _id <= wasteCount, "Invalid waste ID");
        WasteRecord memory waste = wasteRecords[_id];
        return (waste.id, waste.details, waste.status, waste.createdBy); //A tuple containing the ID, details, status, and creator address of the waste record
    }

    function getWasteCount() public view returns (uint) { //Returns the total number of waste records created.
        return wasteCount;
    }
}
