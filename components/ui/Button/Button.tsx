import clsx from 'clsx';
import s from './Button.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

interface IProps {
  variant: 'primary' | 'secondary';
  className?: string;
  children: React.ReactNode;
  
}

const Button = ({ children, variant, className }: IProps) => {
  const rootClassName = clsx(
    s.root,
    {
      [s.solid]: variant === 'primary',
      [s.outline]: variant === 'secondary',
    },
    className
  );

  const { data: session } = useSession();
  const onClickHandler = () => { 
    if (session) { signOut() } else { signIn(); } 
  }

  return (
    <button className={rootClassName}
      onClick={onClickHandler}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
