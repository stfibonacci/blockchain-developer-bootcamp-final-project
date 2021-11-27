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
  

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
