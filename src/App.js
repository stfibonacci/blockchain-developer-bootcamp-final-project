import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import "./App.css";
//import CourseFactory from './artifacts/contracts/CourseFactory.sol/CourseFactory.json';
//import Course from './artifacts/contracts/Course.sol/Course.json';
import Course from './utils/Course.json';
import IERC20 from './utils/IERC20.json';
import CErc20 from './utils/CErc20.json';
import { courseAddress, IERC20Address, CErc20Address } from './Addresses';


function App() {
 
  const [signer, setSigner ] = useState()
  const [course, setCourse] = useState(undefined);
  const [underlying, setUnderlying] = useState(undefined);
  const [cToken, setCtoken] = useState(undefined);
  const [account, setAccount] = useState(null)
  const [fee, setFee] = useState("")
  const [week, setWeek] = useState("")
  const [underlyingBalance, setUnderlyingBalance] = useState("")
  const [cTokenBalance, setCtokenBalance] = useState("")
  const [amount, setAmount] = useState()
  const [approveAmount, setApproveAmount] = useState()
 
  
  const [owner, setOwner] = useState("")
  const [address, setAddress] = useState("")
  const [initFee, setInitFee] = useState("")
  const [initWeek, setInitWeek] = useState("")

  
  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())
  }

  async function requestAccount() {
    if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  }

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        setAccountListener(window.ethereum)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const accounts = await provider.listAccounts();
        const course = new ethers.Contract(courseAddress, Course.abi, signer)
        const underlying = new ethers.Contract(IERC20Address, IERC20.abi, signer)
        const cToken = new ethers.Contract(CErc20Address, CErc20.abi, signer)
       
        setSigner(signer)
        setAccount(accounts[0])
        setCourse(course)
        setUnderlying(underlying)
        setCtoken(cToken)
       

      } else {
        console.error("Please, install Metamask.")
      }
    }
     init()
    
  }, [])

  

  useEffect(() => {
    const load = async () => {
      if (typeof window.ethereum !== 'undefined') {
        
        const coursefee = (await course.courseFee())/ Math.pow(10, 18).toString();
        console.log("Fee: ", coursefee.toString());
        setFee(coursefee)

        const numOfWeeks = (await course.courseNumberOfWeeks()).toString();
        console.log("Week: ", numOfWeeks.toString());
        setWeek(numOfWeeks)

        const balance = (await underlying.balanceOf(courseAddress))/ Math.pow(10, 18).toString();
        console.log("balance: ", balance.toString());
        setUnderlyingBalance(balance) 

        
        const cBalance = (await cToken.balanceOf(courseAddress))/ Math.pow(10, 8).toString();
        console.log("balance: ", cBalance.toString());
        setCtokenBalance(cBalance)

        const owner = await course.owner();
        console.log("owner: ", owner);
        setOwner(owner)
        
      }

    } 
    account && signer && course && underlying && cToken && load()
  }, [ account, signer, course, underlying, cToken ])

  async function initializeCourse() {
    if (typeof window.ethereum !== 'undefined') {
      
      
      const enrollmentIsOpen = true
      const transaction = await course.initialize(IERC20Address, CErc20Address, (initFee * Math.pow(10, 18)).toString(), initWeek, enrollmentIsOpen, address);
      await transaction.wait();
      console.log(`${address} is the owner`);
    }
    window.location.reload()
  }
  

  async function approveCourse() {
    if (typeof window.ethereum !== 'undefined') {
      
      const transaction = await underlying.approve(courseAddress,(approveAmount * Math.pow(10, 18)).toString());
      await transaction.wait();
      console.log(`${approveAmount} dai approved succesfully`);
    }
    
  }

  async function enrollToCourse() {
    if (typeof window.ethereum !== 'undefined') {
      const transaction = await course.enroll((amount * Math.pow(10, 18)).toString());
      await transaction.wait();
      console.log(`${amount} dai paid and succesfully enrolled to Course`);
    }
    window.location.reload()
  }

  async function refundFromCourse() {
    if (typeof window.ethereum !== 'undefined') {
      const transaction = await course.refund();
      await transaction.wait();
      console.log(`${amount} dai refunded`);
    }
    window.location.reload()
  }



  async function start() {
    if (typeof window.ethereum !== 'undefined') {
      const transaction = await course.startCourse();
      await transaction.wait();
      console.log(`course started and funds will be locked ${time} weeks`);
    }
    window.location.reload()
  }

  async function end() {
    if (typeof window.ethereum !== 'undefined') {
      const transaction = await course.endCourse();
      await transaction.wait();
      console.log(`course ended and you can refund now`);
    }
    window.location.reload()
  }



  return (
    <>
      <nav>
        <button className="button is-info is-small" onClick={requestAccount} >Connect Metamask</button>
          <strong>  {account ? account : "Not connected! Connect to Kovan"}   </strong> 
      </nav>
      <div className="course-general">
        <div className="account">
          <div className="account-view is-flex is-align-items-center">
          <h4 className="mr-2 ">Contract Balance: {underlyingBalance} Dai</h4>
          </div>
          <div>
          <h4 className="mr-2 ">Contract Balance: {cTokenBalance} cDai</h4>
          </div>  
          <h4 className="mr-2 ">Course Fee: {fee} Dai</h4>
          <div className="dai-view ">
          </div>  
          <h4 className="mr-2 ">Course Duration: {week} weeks</h4>
          <div className="dai-view ">
          </div>
          <h4 className="mr-2 ">Owner: {owner} </h4>
          <div className="dai-view ">
          </div>

          <div className="creator-view is-size-4">
          <h4>Create Course</h4>
          <p className="is-size-7">Enter the required parameters to create the course</p>
          <input onChange={e => setInitFee(e.target.value)} className="input is-success is-small" type="text" placeholder="Course Fee" />
          <input onChange={e => setInitWeek(e.target.value)} className="input is-success is-small" type="text" placeholder="Number of Weeks" />
          <input onChange={e => setAddress(e.target.value)} className="input is-success is-small" type="text" placeholder="Owner Address" />
          <button disabled={!account} onClick={initializeCourse} className="button is-warning is-small">Initialize</button>
          
          </div>

          <div className="enrollment-view is-size-4 ">
          <h4>Enrollment for students</h4>
          <div>
          <p className="is-size-7">Approve the course fee : {fee} dai</p>
          <input onChange={e => setApproveAmount(e.target.value)} className="input is-success is-small" type="text" placeholder="Amount" />
          <button disabled={!account} onClick={approveCourse} className="button is-warning is-small">Approve</button>
          <p className="is-size-7">Enter the course fee : {fee} dai</p>
          <input onChange={e => setAmount(e.target.value)} className="input is-success is-small" type="text" placeholder="Amount" />
          <button disabled={!account} onClick={enrollToCourse} className="button is-primary is-small">Enroll</button>
          </div>
          <p className="is-size-7">Funds will be locked after enrollment.You can get refund after {week} weeks</p>
          <button disabled={!account} onClick={refundFromCourse} className="button is-danger is-small">Refund</button>
          </div>
          <div className="enrollment-view is-size-4 ">
          <h4>For Creator</h4>
          <button disabled={!account} onClick={start} className="button is-primary mr-2 is-small">Start Course</button>
          <button disabled={!account} onClick={end} className="button is-danger mr-2 is-small">End Course</button>
          <p className="is-size-7">Start:Enrollment ends and funds will be transfered to Compound Vault to earn interest</p>
          <p className="is-size-7">End:Funds will be transfered back to Contract.Rewards are issued to the creator.Students can refund now</p>
          {/* <input onChange={e => setTime(e.target.value)} className="input is-success is-small" type="text" placeholder="Number of Weeks" />
          <button disabled={!account} onClick={updateTimestamp} className="button is-warning is-small">Update Duration</button>
          <p className="is-size-7">update duration to for the new course.</p> */}
          </div>
          
      
        </div>
      </div>
    </>
  );
}

export default App;
