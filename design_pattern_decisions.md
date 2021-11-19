# Design Pattern Decisions

## CIRCUIT BREAKER
* owner can stop all the functions for fund transfer through the circuit breaker 
* enroll, refund, _investToCompound, _withdrawFromComp, _issueRewards cannot be accessed once the contract is paused.

## Guard Check
* modifiers were used to check the conditions beginning of the     functions for validations. 

## Access Control Design Patterns 
* some functions are only accessible by owner. 
* updateUnlockTimestamp, startCourse, endCourse, pauseProtocol,   unpauseProtocol functions have access control.

## Inter-Contract Execution 
* Inter-Contract execution was done through Compound's cToken contract.
* _investToCompound, _withdrawFromComp functions are calling cToken contracts mint and redeem functions.

## Inheritance and Interfaces
* OpenZeppelin IERC20 interface  were used for transfer functions.
* OpenZeppelin Initializable, ReentrancyGuardUpgradeable, PausableUpgradeable libraries were used for security.
* Compound CErc20 Interface were used for transfering money to Ctoken Contract
 
## Factory Contracts
* OpenZeppelin Clones library were used to create Contract Factory

## Optimizing Gas
* OpenZeppelin Clones library were used for Gas Optimizations
* Course contract creation costs 2570244 gas
* Course contract creation costs  320415 gas