const { expect } = require("chai");
const { ethers } = require("hardhat");

 
// hardhat -- dai.connect(addr1).transfer(address1, 100)

describe("Course", function () {
  
  let Course;
  let course;
  let CourseFactory;
  let courseFactory;
  let owner;
  let addr1;
  let addr2;
  let addrs;
  let daiAddrress;
  let cDaiAddress;
  let addDecimals;
  let courseFee;
  let courseNumOfWeeks;
  let courseIsOpen;
 

  beforeEach(async function () {
  
    Course = await ethers.getContractFactory("Course");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    course = await Course.deploy();
    await course.deployed();

    CourseFactory = await ethers.getContractFactory("CourseFactory");
    courseFactory = await CourseFactory.deploy(course.address);
    await courseFactory.deployed();

  });

  describe("Deployment", function () {
  
    it("it shouldn't have an owner", async function () {
      expect(await course.owner()).to.equal('0x0000000000000000000000000000000000000000');
    });

    it("it shouldn't set course fee", async function () {
      expect(await course.courseFee()).to.equal("0");
    });

    it("it shouldn't have any user", async function () {
      expect(await course.NumCustomers()).to.equal("0");
    });

    it("it shouldn't set an unlock date", async function () {
      expect(await course.unlockTimestamp()).to.equal("0");
    });
    
    
  })

  describe("Initialization", function () {
    beforeEach(async function () {
      
      daiAddrress = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
      cDaiAddress = "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad"
      addDecimals = Math.pow(10, 18);
      courseFee = 2 * addDecimals;
      courseNumOfWeeks = 5
      courseIsOpen = true
     
      const initTx = await course.initialize(daiAddrress , cDaiAddress, courseFee.toString() , courseNumOfWeeks,courseIsOpen, owner.address);
      await initTx.wait();

    });

    describe("Init", function () {
       it("it should have the right owner", async function () {
         expect(await course.owner()).to.equal(owner.address);
      });

      it("it should have the right course fee", async function () {
        expect(await course.courseFee()).to.equal(courseFee.toString());
      });

      it("it should have the right underlying token address", async function () {
        expect(await course.underlying()).to.equal(daiAddrress);
      });

      it("it should have Enrollment to be open", async function () {
        expect(await course.enrollmentIsOpen()).to.equal(true);
      });
    
      it("it should revert startCourse if not the owner", async function () {
        await expect(course.connect(addr1).startCourse()).to.be.revertedWith("caller is not the owner");
      });

      it("it should not enroll if not the right course fee", async function () {
        await expect(course.connect(addr1).enroll(10)).to.be.revertedWith("amount is not equal to course fee");
      });

      it("it should not refund if user doesn't have a balance", async function () {
        await expect(course.connect(addr1).refund()).to.be.revertedWith('you didnt enroll');
      });


      it("it should revert endCourse if not the owner", async function () {
        await expect(course.connect(addr1).endCourse()).to.be.revertedWith("caller is not the owner");
      });

      it("it should revert pauseProtocol if not the owner", async function () {
        await expect(course.connect(addr1).pauseProtocol()).to.be.revertedWith("caller is not the owner");
      });
      

      it("it should revert unpauseProtocol if not the owner", async function () {
        await expect(course.connect(addr1).unpauseProtocol()).to.be.revertedWith("caller is not the owner");
      });

      it("it should revert updateUnlockTimestamp if not the owner", async function () {
        await expect(course.connect(addr1).updateUnlockTimestamp(4)).to.be.revertedWith("caller is not the owner");
      });
      

    })
    
    
  })


  describe("Course Factory", function () {
     
    let cloneInstance;
   
    beforeEach(async function () {

      const createClone = await courseFactory.connect(addr2).createCourse(daiAddrress, cDaiAddress, courseFee.toString() , courseNumOfWeeks, courseIsOpen)
      await createClone.wait();
      const { interface } = await ethers.getContractFactory('Course');
      const contractAddress = await courseFactory.cloneAddresses(0);
      cloneInstance = new ethers.Contract(contractAddress, interface, owner);
      
    });
    
    describe("Clone Deployment", function () {
     
      it("it should create new Course and set the right owner", async function () {
        const cloneOwner = await cloneInstance.owner();
        expect(await cloneOwner).to.equal(addr2.address);
      
      });

      it("it should have right course fee", async function () {
        expect(await cloneInstance.courseFee()).to.equal(courseFee.toString())
     
      });

      it("it should fail if not the owner", async function () {
        await expect(course.connect(addr1).startCourse()).to.be.revertedWith("caller is not the owner");
      });
      
    
    })

  })

  
});
