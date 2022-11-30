import { getProviders, signIn } from "next-auth/react"
import SignIn from "@components/Login/Login"
export default function LogIn({ providers } : {providers: any}) {
  return (
    <SignIn providers={providers}/>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
