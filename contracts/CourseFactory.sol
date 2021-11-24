// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Course.sol";


///@title CourseFactory 
///@notice This contract creates Course clones
contract CourseFactory {
     

    ///@dev Address of the implemented contract
    address immutable implementation;

    ///@dev this array stores Course clone addresses
    address[] public cloneAddresses;

  
    constructor(address _implementation) {
        implementation = _implementation;
    }

    ///@notice This creates Course clones and initializes msg.sender as owner
    ///@param _underlyingAddress This is the address of the DAI token.
    ///@param _cTokenAddress This is the address of the cDAI token.
    ///@param _fee This is required fee to enroll to the Course.
    ///@param _courseNumberOfWeeks This sets how many weeks the Course will continue.
    ///@param _enrollmentIsOpen This is required to be true for starting the enrollment 
    function createCourse(
      address _underlyingAddress, 
      address _cTokenAddress, 
      uint _fee, 
      uint _courseNumberOfWeeks,
      bool _enrollmentIsOpen
    ) external returns (address) {
      address clone = Clones.clone(implementation);
      Course(clone).initialize(_underlyingAddress, _cTokenAddress, _fee, _courseNumberOfWeeks, _enrollmentIsOpen, msg.sender);
      cloneAddresses.push(clone);
      return address(clone);

    }
    
    ///@notice This function returns all the Course clone addresses
    function getCloneAddresses() 
      public 
      view 
      returns(address[] memory) 
    {
        return cloneAddresses;
    }
}
