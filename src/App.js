import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import "./App.css";
import Course from './artifacts/contracts/Course.sol/Course.json'
import IERC20 from './artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json'
import CErc20 from './artifacts/contracts/Course.sol/CErc20.json'


const courseAddress = "0xde169528c593b0Ba14c7A3C685B000ab6693b289"
const courseFactory = "0x3F17d375236F94C77fEa4B6304E8A63A56a07708"
const IERC20Address = "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"
const CErc20Address = "0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad"
//const courseAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"



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
  const [time, setTime] = useState("")

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

      }

    } 
    account && signer && course && underlying && cToken && load()
  }, [ account, signer, course, underlying, cToken ])
  

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

  async function updateTimestamp() {
    if (typeof window.ethereum !== 'undefined') {
      const transaction = await course.updateUnlockTimestamp(time);
      await transaction.wait();
      console.log(`course duration updated and it will be ${time} weeks`);
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
          <strong>  {account ? account : "not connected"}   </strong> 
      </nav>
      <div className="course-general">
        <div className="account">
          <div className="account-view is-flex is-align-items-center">
          <strong className="mr-2 ">Contract Balance: {underlyingBalance} Dai</strong>
          </div>
          <div>
          <strong className="mr-2 ">Contract Balance: {cTokenBalance} cDai</strong>
          </div>  
          <strong className="mr-2 ">Course Fee: {fee} Dai</strong>
          <div className="dai-view ">
          </div>  
          <strong className="mr-2 ">Course Duration: {week} weeks</strong>
          <div className="dai-view ">
          </div>
          <div className="enrollment-view is-size-4">
          <h4>Enrollment</h4>
          <div>
          <input onChange={e => setApproveAmount(e.target.value)} className="input is-success is-small" type="text" placeholder="Amount" />
          <button disabled={!account} onClick={approveCourse} className="button is-warning is-small">Approve</button>
          <input onChange={e => setAmount(e.target.value)} className="input is-success is-small" type="text" placeholder="Amount" />
          <button disabled={!account} onClick={enrollToCourse} className="button is-primary is-small">Enroll</button>
          </div>
          <button disabled={!account} onClick={refundFromCourse} className="button is-danger is-small">Refund</button>
          </div>
          <div className="creator-view is-size-4">
          <h4>Creator</h4>
          <input onChange={e => setTime(e.target.value)} className="input is-success is-small" type="text" placeholder="Number of Weeks" />
          <button disabled={!account} onClick={updateTimestamp} className="button is-warning is-small">Duration</button>
          <div>
          <button disabled={!account} onClick={start} className="button is-primary mr-2 is-small">Start Course</button>
          <button disabled={!account} onClick={end} className="button is-danger mr-2 is-small">End Course</button>
          </div>
          
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
