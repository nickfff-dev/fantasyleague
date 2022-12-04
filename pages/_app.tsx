// Core imports
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Session } from "next-auth"
import { SessionProvider } from 'next-auth/react';


// Components
import { Layout } from '@components/shared';

function MyApp({ Component, pageProps }: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
