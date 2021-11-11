const hre = require("hardhat");


async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  
  const Course = await hre.ethers.getContractFactory("Course");
  const course = await Course.deploy();
  await course.deployed();
  console.log("Course deployed to:", course.address);


  // const CourseFactory = await hre.ethers.getContractFactory("CourseFactory");
  // const courseFactory = await CourseFactory.deploy(course.address);
  // await courseFactory.deployed();
  // console.log("CourseFactory deployed to:", courseFactory.address);

  ///////// initialize //////////////////

  //mainnet
  // const daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f' 
  // const cDaiAddress = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'
  
  //kovan
  // const dai = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
  // const Cdai = "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad"

  // const decimals = 18;
  // const courseFee = 2 * Math.pow(10, decimals)
  // const courseNumOfWeeks = 5
  // const enrollmentIsOpen = true
  // const initTx = await course.initialize(dai, Cdai, courseFee.toString() , courseNumOfWeeks, enrollmentIsOpen, deployer.address);
  // await initTx.wait();
  // const owner = await course.owner()
  // console.log("Course is initialized and ownership assigned to:", owner);  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
