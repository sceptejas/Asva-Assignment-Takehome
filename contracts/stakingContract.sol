// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract StakingContract is ReentrancyGuard, Ownable {
    IERC20 public stakingToken;

    // Mapping to store staked balances for each user
    mapping(address => uint256) public stakedBalances;

    // Total tokens staked in the contract
    uint256 public totalStaked;

    // Events
    event Staked(address indexed user, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed user, uint256 amount, uint256 timestamp);
    event TokensWithdrawn(address indexed owner, uint256 amount);

    constructor(address _stakingToken) Ownable(msg.sender) {
        require(_stakingToken != address(0), "Invalid token address");
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            stakingToken.balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );
        require(
            stakingToken.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        // Transfer tokens from user to this contract
        bool success = stakingToken.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        // Update user's staked balance
        stakedBalances[msg.sender] += amount;
        totalStaked += amount;

        emit Staked(msg.sender, amount, block.timestamp);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(
            stakedBalances[msg.sender] >= amount,
            "Insufficient staked balance"
        );

        // Update user's staked balance
        stakedBalances[msg.sender] -= amount;
        totalStaked -= amount;

        // Transfer tokens back to user
        bool success = stakingToken.transfer(msg.sender, amount);
        require(success, "Token transfer failed");

        emit Unstaked(msg.sender, amount, block.timestamp);
    }

    function getStakedBalance(address user) external view returns (uint256) {
        return stakedBalances[user];
    }

    function getTokenBalance(address user) external view returns (uint256) {
        return stakingToken.balanceOf(user);
    }

    function getTotalStaked() external view returns (uint256) {
        return totalStaked;
    }

    function getContractBalance() external view returns (uint256) {
        return stakingToken.balanceOf(address(this));
    }

    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        require(
            stakingToken.balanceOf(address(this)) >= amount,
            "Insufficient contract balance"
        );

        bool success = stakingToken.transfer(owner(), amount);
        require(success, "Token transfer failed");

        emit TokensWithdrawn(owner(), amount);
    }

    function getStakingToken() external view returns (address) {
        return address(stakingToken);
    }
}