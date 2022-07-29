import React from "react";
import Link from 'next/link'

const Home = () => {
  const denied_h1 = {
    textAlign: "center",
    fontSize: "30px",
  }
  const denied_background = {
    backgroundSize: "100% 100%",
    marginBottom:"0px",
    paddingTop:"10px",
    paddingRight:"45px",
    paddingLeft:"45px",
    width: "100vw",
    height: "100vh",
  }
  const denied_a = {
    border:"none",
    borderColor:"white",
    borderRadius:"20px",

  }
  return(
    <div>
      <h1 style={denied_h1}>You Need To <Link href="/api/auth/signin"><a style={denied_a}>Login</a></Link> To Create A Volunteer Profile.</h1>
    </div>
  )
}

export default Home;

