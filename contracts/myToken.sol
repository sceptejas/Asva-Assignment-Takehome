// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) Ownable(msg.sender) {
        // Mint initial supply to the contract deployer
        _mint(msg.sender, initialSupply * 10**decimals());
    }

    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }
}