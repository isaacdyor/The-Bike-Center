import React from "react";
import Link from 'next/link'

const Home = () => {
  return(
    <div>
      <p>You need to <Link href="/api/auth/signin"><a>login</a></Link> to create a volunteer profile.</p>
    </div>
  )
}

export default Home;

