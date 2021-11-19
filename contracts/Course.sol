// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";



interface CErc20 {
  function mint(uint256) external returns (uint256);

  function redeem(uint) external returns (uint);

  function balanceOf(address owner) external view returns (uint);

}

///@title Course - Implementation Contract
///@dev This contract needs to be initialized after deployment 
contract Course is 
    Initializable, 
    ReentrancyGuardUpgradeable, 
    PausableUpgradeable  {

    ///@dev Address of Underlying Token that will be used to enroll the Course
    IERC20 public underlying;

    ///@dev Address of cToken contract that deposits will be sent to after Course started
    CErc20 public cToken; 
     
    ///@dev Owner will be 0x000 address after deployment and it will change after initialization
    address public owner;

    ///@dev Stores number of user attend the Course
    uint public NumCustomers;

    ///@dev Represents the Course's fee
    uint public courseFee;

    ///@dev Represents the Course ends date
    ///@notice Funds will be unlocked at this date
    uint public unlockTimestamp;
    
    ///@dev Represents how many weeks the Course will last
    uint public courseNumberOfWeeks;

    ///@dev Users can attend the Course as long as the enrollment is open
    bool public enrollmentIsOpen;
    
    
    ///@notice This initializes state variables of this contract and works like a constructor.
    ///@dev Do not leave this implementation contract uninitialized and Invoke the initializer manually!
    ///@param _underlyingAddress This is the address of the Underlying token.
    ///@param _cTokenAddress This is the address of the cToken token.
    ///@param _fee This is required fee to enroll to the Course.
    ///@param _courseNumberOfWeeks This sets deadline for the Course.
    ///@param _enrollmentIsOpen This is required to be true for starting the enrollment 
    ///@param _owner This is the address of the Course creator.
    function initialize(
        address _underlyingAddress,
        address _cTokenAddress, 
        uint _fee, 
        uint _courseNumberOfWeeks,
        bool _enrollmentIsOpen, 
        address _owner
      ) public initializer {

        require(
          _underlyingAddress != address(0),
            "Underlying Token Address cannot be 0"
        );
        require(
            _cTokenAddress != address(0),
            "cToken Address cannot be 0"
        );
        

        __Pausable_init();
        __ReentrancyGuard_init();

         underlying = IERC20(_underlyingAddress);
         cToken = CErc20(_cTokenAddress);
         enrollmentIsOpen = _enrollmentIsOpen;
         courseFee = _fee ;
         courseNumberOfWeeks = _courseNumberOfWeeks;
         unlockTimestamp = block.timestamp + (courseNumberOfWeeks * 1 weeks); 
         owner = _owner;
    }
    
    
    ///@dev This maps an address to bool to check if user purchased the Course 
    mapping(address => bool) public isCustomerPaid; 

    ///@dev This maps an address to number of Undelying Token used to enroll for Course
    mapping(address => uint) public userBalances;

   
    ///@dev Emitted after enrollment
    event PaymentMade(
        address indexed userAddress, 
        uint fee
    );

    ///@dev Emitted after refund made
    event RefundMade(
        address indexed customerAddress,
        uint fee
    );
    ///@dev Emitted after rewards are issued to the creator 
    event RewardsIssued(
        address indexed owner,
        uint amount,
        uint date
    );
    
    ///@dev Emitted after deposit made to Compound
    event InvestToComp(
        string description,
        uint amount
    );

    ///@dev Emitted after funds withdrawn from Compound
    event WithdrawnFromComp(
        string description,
        uint amount
    );

    
    ///@dev Checks if caller is Course owner
    modifier onlyOwner() {
        require(owner == msg.sender, "caller is not the owner");
        _;
    }
    
    ///@dev Checks if user has balance before refund
    modifier hasBalance() {
        require(userBalances[msg.sender] == courseFee, 'you didnt enroll');
         _;
    }
    
    ///@dev Checks if user has already paid for Course
    modifier hasPaid() {
        require(!isCustomerPaid[msg.sender], 'user already paid content fee');
        _;
    }

    ///@dev Checks if Course ended before refund the user
    modifier timeLocked() {
      require(block.timestamp >= unlockTimestamp, 'balance is locked during the Course');
      _;
  }
    
    ///@notice This function update unlockTimestamp
    ///@param _courseNumberOfWeeks New deadline for new Course.
    function updateUnlockTimestamp(uint _courseNumberOfWeeks) 
    external 
    onlyOwner
    {
      courseNumberOfWeeks = _courseNumberOfWeeks;
      unlockTimestamp = block.timestamp + (courseNumberOfWeeks * 1 minutes);
    }
    
    ///@notice Starts Course , ends enrollment and calls the internal method _investToCompound
    function startCourse()  
      external
      onlyOwner 
    {
      require(
        enrollmentIsOpen == true,
        "Course has already started"
      );
      
      _investToCompound();
      enrollmentIsOpen = false;
      
    } 
    
    ///@notice Ends Course calls the internal method _withdrawFromComp , _issueRewards
    function endCourse() 
      external
      onlyOwner 
     {
      require(
        enrollmentIsOpen == false,
        "Course has already ended"
      );
      _withdrawFromComp();
      _issueRewards();
      enrollmentIsOpen = true;
    }
    
    ///@notice Transfers approved amount of Underlying Tokens from user wallet to contract
    ///@param _courseFee Amount of Underlying tokens that need to be transfered
    function enroll(uint _courseFee) 
    external 
      hasPaid 
      nonReentrant 
      whenNotPaused
    {
      require(
          _courseFee == courseFee , 
          "amount is not equal to course fee"
      );
      require(
          enrollmentIsOpen == true,
          "Course has already started"
      );
      

      underlying.transferFrom(msg.sender, address(this), _courseFee);
      userBalances[msg.sender] = _courseFee;
      isCustomerPaid[msg.sender] = true;
      NumCustomers++;
       
      emit PaymentMade(msg.sender, _courseFee );
    }
    
    ///@notice Transfers course fee back to user and locks it during Course
    function refund() 
      external  
      hasBalance 
      nonReentrant 
      timeLocked 
      whenNotPaused 
    {
      require(
            userBalances[msg.sender] == courseFee, 
            'you dont have a balance'
      );
        
      uint underlyingBalance = userBalances[msg.sender]; 
      underlying.transfer(msg.sender, underlyingBalance);
      userBalances[msg.sender] = 0;
      isCustomerPaid[msg.sender] = false;
      NumCustomers--;
      
      emit RefundMade(msg.sender, underlyingBalance);
    }
        
    ///@notice Deposits contract balance of Underlying tokens to Compound and mint cToken tokens
    function _investToCompound() 
      internal 
      whenNotPaused  
    {
      uint _amount = underlying.balanceOf(address(this));
      underlying.approve(address(cToken), _amount);
      cToken.mint(_amount);

      emit InvestToComp("Funds sent to Comp", _amount);    
    }

    ///@notice Withdraws Underlying from Compound and burn cToken tokens
    function _withdrawFromComp()
      internal 
      whenNotPaused  
     {
      uint _amount = cToken.balanceOf(address(this));
      cToken.redeem(_amount);
        
      emit WithdrawnFromComp("Funds withdrawn from Comp", _amount);
    }

    ///@notice issues accumulated yields from Compound to Owner
    function _issueRewards() 
      internal 
      whenNotPaused
    {
      uint rewards = getRewardsBalance();
      underlying.transfer(owner, rewards);

      emit RewardsIssued(owner, rewards, block.timestamp);
    }

    ///@notice This method pauses all the transfers and can only be called by owner
    function pauseProtocol() external virtual onlyOwner {
      _pause();
    }

    ///@notice This method un-pauses all the transfers and can only be called by owner
    function unpauseProtocol() external virtual onlyOwner {
      _unpause();
    }
 
    
    ///@notice This function returns amount of Underlying token rewards
    function getRewardsBalance() 
      public
      view 
      returns(uint) 
    {
      uint contractBalance = getUnderlyingBalance();
      uint refundAmount = NumCustomers * courseFee;
      uint rewardAmount = contractBalance - refundAmount;
      return rewardAmount;
    }  



    ///@notice This function returns amount of Underlying token that user has in the contract
    function getUserBalance() 
      public 
      view 
      returns(uint) 
    {
      return userBalances[msg.sender];
    }
    
    ///@notice This function returns amount of Underlying token that contract has
    function getUnderlyingBalance() 
      public 
      view 
      returns(uint) 
    {
      return underlying.balanceOf(address(this));
    }
    
    ///@notice This function returns amount of cToken token that contract has
    function getCTokenBalance() 
      public 
      view 
      returns(uint) 
    {
      return cToken.balanceOf(address(this));
    }
    
 }

 