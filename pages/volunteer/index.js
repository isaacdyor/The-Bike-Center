import React from "react";
import Link from 'next/link'

const Home = () => {
  const denied_h1 = {
    textAlign: "center",
    fontSize: "200px",
  }
  const denied_background = {
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/963/87/601/light-blue-background-hd-wallpaper-wallpaper-preview.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    marginBottom:"0px",
    paddingTop:"10px",
    paddingRight:"45px",
    paddingLeft:"45px",
    width: "100vw"
  }
  const denied_a = {
    border:"none",
    borderColor:"white",
    borderRadius:"20px",

  }
  return(
    <div style={denied_background}>
      <h1 style={denied_h1}>You Need To <Link href="/api/auth/signin"><a style={denied_a}>Login</a></Link> To Create A Volunteer Profile.</h1>
    </div>
  )
}

export default Home;

