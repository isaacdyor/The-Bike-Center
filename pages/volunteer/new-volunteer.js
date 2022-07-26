import React from "react";
import Link from 'next/link'
import {useSession} from "next-auth/react";
import Image from 'next/image'

const Volunteer = () => {
  const { data: session, status } = useSession();
  
  const newvol_h1 = {
    textAlign: "center",
    fontSize: "50px",
    width: "60vw",
    marginLeft : "13vw",
  }
  const newvol_background = {
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/963/87/601/light-blue-background-hd-wallpaper-wallpaper-preview.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    marginBottom:"0px",
    paddingTop:"10px",
    paddingRight:"45px",
    paddingLeft:"45px",
    width: "100vw",
  }
  const newvol_a = {
    border:"none",
    borderColor:"white",
    borderRadius:"20px",

  }
  const h4_styling = {
    paddingTop: "5vw",
    width: "80vw",
    marginLeft : "5vw",
    fontSize : "max(2vw, 10px)",
    fontWeight: "900",
    textAlign: "center",
    paddingBottom: "5vw",
    color: "white",
    textShadow:"-2px 3px 0 #000",    
  }
  const img_one = {
    float : "left",
    transform: "scaleX(-1)",
    width: "20vw",
  }
  const img_two =  {
    float : "right",
    width: "20vw",
  }
  return(
    <div style = {newvol_background}>
      <div>
        <h1 style = {newvol_h1}>Successfully Signed Up As A Volunteer!!!</h1>
      </div>
      
      <h4 style = {h4_styling}>When someone requests you to pick up a bike for them an email will be sent to the email address you logged in with.
      You can also find a list of all of your assignments on the <Link href={`/volunteer/${session?.user?.id}`}><a style = {newvol_a}>Volunteer</a></Link> page.
      Once you have completed a donation you submit it at the <Link href='/donation/'><a style = {newvol_a}>Donation</a></Link> page.</h4>

    </div>
  )
}

export default Volunteer;

