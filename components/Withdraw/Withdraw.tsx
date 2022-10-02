import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, Wallet, Withdrawal, User } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';


const WithdrawPage = ({ owner }: { owner: User }) => { 
  
    const { data: session } = useSession();
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [responsetext, setResponseText] = useState("")
  
  const onWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setWithdrawAmount(Number(e.target.value));
    }
  
    const onWithdrawAmountSubmit = async () => {
      let amount = withdrawAmount
      let userName = session?.user?.name?.toString()
      let email = owner.email
      let userId = owner.id
      let task = "save withdrawal"
      let birthday = owner.birthDate
  
      try {
        await fetch(`/api/user/${owner.name}`, {
          method: 'POST',
          body: JSON.stringify({
            amount,
            userName,
            birthday,
            userId,
            email,
            task
          })
        }).then((res) => {
          res.text().then((text) => {
            setResponseText(text)
  
          })
  
        })
  
      } catch (err: any) {
        console.error(err.message);
      }
  
    }
  
    return (
      <div className={s.container}>
  
        <label htmlFor="withdrawAmount" >Withdraw Amount
          <input type="number"  onChange={onWithdrawAmountChange} /> </label>
        <button onClick={onWithdrawAmountSubmit}>confirm</button>
        <p>{responsetext}</p>
      
      </div>
    )
}


export default WithdrawPage
