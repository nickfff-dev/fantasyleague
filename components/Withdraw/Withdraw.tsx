import { Grid } from '@components/ui';
import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import { Fixture, Teams, League, Players, Participant, Wallet, Withdrawal, User } from "@prisma/client"
import s from "@components/HomePage/Insights/Seasons/Seasons.module.css";
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';


const WithdrawPage = ({ owner, wallet }: { owner: User, wallet: Wallet }) => { 
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  }


  
    const { data: session } = useSession();
    const [withdrawAmount, setWithdrawAmount] = useState(0);
    const [responsetext, setResponseText] = useState("")
  
  const onWithdrawAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
    setWithdrawAmount(Number(e.target.value));
    
  }
  const resetForm = () => { 
    setWithdrawAmount(0)
    setResponseText("")

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
            refreshData()
  
          })
  
        })
  
      } catch (err: any) {
        console.error(err.message);
      }
  
    }
  
    return (
      <Grid>
  
        <div className={s.container} >
        <label htmlFor="withdrawAmount" >Withdraw Amount
            <input type="number" name="withdrawAmount" style={{ color: "black" }} onChange={onWithdrawAmountChange} />  </label><br/>
          <button onClick={onWithdrawAmountSubmit}>confirm</button>

          <p>balance: ${wallet.balance}</p>
          <p>new balance: 
            ${wallet.balance}
          </p>
          <p>{responsetext}</p>
    </div>
      
      </Grid>
    )
}


export default WithdrawPage
