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

  const navClassNames = clsx([s.nav_links]);

  const toggleMenu = () => { 
    setOpen(!isOpen);

  }
  return (
    <div className={s.root}>
     
      <nav className="text-xl mobile:text-base tablet:text-base uppercase  px-2 px-4 py-2.5  w-full z-10 top-0 left-0">
        <div className="container flex  items-center justify-between mx-auto">
      <a href="/" className={`${s.logo} flex items-center`}>
        
            <Image src={Logo} alt='Website logo' height={60} width={60} />
     
        <h1 className="self-center text-3xl">SPLT SCRN</h1>
          </a>
          <div className="flex flex-row  order-2 gap-x-2 ">
          <div className={s.btns}>
        {session ? (<button className="outline outline-[#ff921b] px-5 h-6 text-[#ff921b] rounded-xl text-sm"><span className="bg-gradient-to-r from-primary via-[#f43d00] to-[#ff921b] bg-clip-text  font-bold text-transparent">{session?.user?.name} </span></button>) : null}
        {
          session ? (
            <Button variant='secondary'>Sign out</Button>
          ) : (
            <Button variant='primary' >Sign in</Button>
          )
        }
      </div>
            <div className={s.burger}>
   
              <button data-collapse-toggle="navbar-sticky" onClick={() => {toggleMenu()
}}type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
    </button>
        </div>
          

          </div>
          <div className={`${isOpen ? 'block' : 'tablet:hidden mobile:hidden  '} ${s.kula} items-center justify-between  w-full md:flex w-auto md:w-auto md:block order-1 mobile:order-1`} id="navbar-sticky">
          <ul className="flex p-4 mt-4 space-x-5 flex-row mobile:flex-col mobile:space-x-0 tablet:space-x-0 tablet:flex-col laptop:space-x-8 mt-0 "><Link href='/user/profile'> My account </Link>
          <li > <Link href='/stats'> Stats </Link></li>
          <li>  <Link href='/alleagues'> leagues </Link></li>
          <li>  <Link href='/create-league'> create-league </Link></li>
            </ul>
</div>
    

 
          </div>
      </nav>

    
    </div>
  );
};

export default Header;
