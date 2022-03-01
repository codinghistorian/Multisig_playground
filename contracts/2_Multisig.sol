// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract MultiSigWallet {
    event Deposit(address indexed sender, uint amount);
    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Revoke(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);

    struct Transaction {
        address to;
        uint value;
        bytes data;
        bool executed;
    }
    

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public required;

    Transaction[] public transactions;
    // mapping from tx id => owner => bool
    mapping(uint => mapping(address => bool)) public approved;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txId) {
        require(_txId < transactions.length, "tx does not exist");
        _;
    }

    modifier notApproved(uint _txId) {
        require(!approved[_txId][msg.sender], "tx already approved");
        _;
    }

    modifier notExecuted(uint _txId) {
        require(!transactions[_txId].executed, "tx already executed");
        _;
    }

    constructor(address[] memory _owners, uint _required) {
        require(_owners.length > 0, "owners required");
        require(
            _required > 0 && _required <= _owners.length,
            "invalid required number of owners"
        );

        for (uint i; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner is not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        required = _required;
    }
    
    function submit(address _to, uint _value, bytes calldata _data) external {
        require(isOwner[msg.sender], "You are not one of owners");
        Transaction memory transaction;
        transaction.to = _to;
        transaction.value = _value;
        transaction.data = _data;
        transactions.push(transaction);
        emit Submit(transactions.length - 1);
    }
    
    function approve(uint _txId) external {
        require(isOwner[msg.sender], "You are not one of owners");
        require(_txId < transactions.length, "tx does not exist");
        require(!transactions[_txId].executed, "transaction executed already");
        // mapping(uint => mapping(address => bool)) public approved;
        require(!approved[_txId][msg.sender], "transaction already approved");
        approved[_txId][msg.sender] = true;
        emit Approve(msg.sender, _txId);
    }
    
// So I guess I should loop through all the owners to check how many trues there are
// huh?
    function _check(uint _txId) view internal returns(uint) {
        uint approvals;
        for (uint i; i < owners.length; i++) {
            if(approved[_txId][owners[i]] == true){
                approvals += 1;
            }
        }
        return approvals;
    }
        
    function execute(uint _txId) external {
        require(isOwner[msg.sender], "You are not one of owners");
        require(_txId < transactions.length, "tx does not exist");
        require(!transactions[_txId].executed, "transaction executed already");


        require(required <= _check(_txId), "not eough approvals");
        Transaction storage transaction = transactions[_txId];
        transaction.executed = true;
        (bool success, ) = transaction.to.call{value: transaction.value}(
            transaction.data    
        );
        require(success, "tx failed");
        emit Execute(_txId);
    }
    
    function revoke(uint _txId) external {
        require(isOwner[msg.sender], "You are not one of owners");
        require(_txId < transactions.length, "tx does not exist");
        require(!transactions[_txId].executed, "transaction executed already");
        require(approved[_txId][msg.sender], "transaction is not approved");
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender, _txId);
    }
    
    fallback() external payable{
        emit Deposit(msg.sender, msg.value);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}