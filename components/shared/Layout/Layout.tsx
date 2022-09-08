// Components
import { Header, Footer } from '@components/shared';

// styles
import s from './Layout.module.css';

interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return (
    <div className={s.root}>
      <Header />
      <main className={s.content}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
