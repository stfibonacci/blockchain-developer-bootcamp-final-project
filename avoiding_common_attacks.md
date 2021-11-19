# SECURITY DECISIONS AND CONSIDERATIONS AGAINST COMMON ATTACKS

## Pull Over Push (SWC-128)
* Refund function lets users withdraw fund from the contract instead of pushing funds to them automatically.

## Proper Use of Require, Assert and Revert  (SWC-123)
* Require function was used to ensure valid conditions

## Use Modifiers Only for Validation
* Modifiers were used for checks before the function body

## Re-entracy Attacks (SWC-107)
* ReentrancyGuard was used to prevent reentrant calls and loss of funds

## Timestamp Dependence (SWC-116)
* Timestamp was not used for randomness 

## Tx.Origin Authentication (SWC-115)
* Tx.Origin was avoided and msg.sender was used for authorization