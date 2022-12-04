import { signIn } from "next-auth/react"
import S from  "./login.module.css"
export default function SignIn({ providers } : {providers: any}) {
  return (
    <div className={`${S.root}`}>
      <div className={`${S.loginContainer}`}>
        <div className={`${S.loginContainerInner}`}>
          <h1>Log in</h1>
          <div className={`${S.loginCardOuter}`}>
          <div className={`${S.loginCardInner}`}>
      {Object.values(providers).map((provider:any) => (
        <div className={`${S.buttongr}`} key={provider.name}>
          <button className={`${S.btnlgin}`} onClick={() => signIn(provider.id, { callbackUrl: 'http://localhost:3000/user/profile' })}>
           <span> Sign in with {provider.name}</span>
          </button>
        </div>
      ))}
          </div>
          </div>
          </div>
        </div>
    </div>
  )
}
