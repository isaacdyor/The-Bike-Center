import React from "react";
import Link from 'next/link'
import {useSession} from "next-auth/react";

const Volunteer = () => {
  const { data: session, status } = useSession();

  const newvol_h1 = {
    textAlign: "center",
    fontSize: "50px",
    width: "60vw",
    marginLeft : "13vw",
  }
  const newvol_background = {
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
    fontWeight: "200",
    textAlign: "center",
    paddingBottom: "5vw",
    color: "dark-grey",
  }
  return(
    <div style = {newvol_background}>
      <div>
        <h1 style = {newvol_h1}>Successfully Requested A Pickup!!!</h1>
      </div>

      <h4 style = {h4_styling}>The volunteer you just requested will send you an email within the next couple of
      days so you can schedule a pickup. Thank you for using The Bike Center!</h4>

    </div>
  )
}

export default Volunteer;

