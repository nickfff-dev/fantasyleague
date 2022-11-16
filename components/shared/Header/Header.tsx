// Core imports
import { useState } from 'react';
import Image from 'next/future/image';
import Link from 'next/link';

// Styles
import s from './Header.module.css';

// 3rd party modules
import { useSession, signIn, signOut } from 'next-auth/react';
import clsx from 'clsx';

// Components
import { Twirl as Hamburger } from 'hamburger-react';
import { Button } from '@components/ui';

// images
import Logo from '@public/images/logo.svg';
import { type } from 'os';


const navLinks = ['Home', 'My Leagues', 'Join a League', 'Create a League'];

const Header = ({ 
  
}) => {
  const [isOpen, setOpen] = useState(false);
  const { data: session } = useSession();

  const username = session?.user?.name || 'Guest';
  const navClassNames = clsx([s.nav_links]);


  return (
    <div className={s.root}>
      <div className={s.logo}>
        <Image src={Logo} alt='Website logo' height={60} width={60} />
        <div className={s.burger}>
          <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <h1>SPLT SCRN</h1>
      </div>

      <nav className={navClassNames}>
        <Link href='/user/profile'> My account </Link>
        <Link href='/user/wallet'> wallet </Link>
        <Link href='/alleagues'> leagues </Link>
        <Link href='/create-league'> create-league </Link>

        {/* {navLinks.map((link) => {
          const slug = link.replaceAll(' ', '').toLowerCase();
          if (slug === "myleagues") 
          {
           
            return (
              <Link href={`/${slug}/${session?.user?.name}`} key={slug}>
              
            
                <a>{link}</a>
              </Link>
            );
          
            }

          return (
            <Link key={link} href={`/${slug}`}>
              <a>{link}</a>
            </Link>
          );
        })} */}
      </nav>

      <div className={s.btns}>
        {session ? (<button className="outline outline-[#ff921b] px-6 h-6 text-[#ff921b] rounded-xl "><span className="bg-gradient-to-r from-primary via-[#f43d00] to-[#ff921b] bg-clip-text  font-bold text-transparent">{session?.user?.name} </span></button>) : null}
        {
          session ? (
            <Button variant='secondary' >Sign out</Button>
          ) : (
            <Button variant='primary' >Sign in</Button>
          )
        }
      </div>
    </div>
  );
};

export default Header;
