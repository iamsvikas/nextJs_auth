/** @format */
import { logout } from '@/actions/auth-actions';
import '../globals.css';

export const metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

const AuthLayout = ({ children }) => {
  return (
    <>
      <header id="auth-header">
        <p>Welcome back!</p>
        <form action={logout}>
          <button>Logout</button>
        </form>
      </header>
      {children}
    </>
    // <html lang="en">
    //   <body>
    //     <header id="auth-header">
    //       <p>Welcome back!</p>
    //       <form>
    //         <button>Logout</button>
    //       </form>
    //     </header>
    //     {children}
    //   </body>
    // </html>
  );
};

export default AuthLayout;
