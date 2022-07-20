import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export const Header = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (!session) {
    return(
      <div>
        <h1>Home</h1>
        <Link href="/api/auth/signin"><button>Become A Volunteer</button></Link>

      </div>
    )
  }
  return(
    <div>
      <h1>Home</h1>

    </div>
  )
};

export default Header