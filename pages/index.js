import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import Router, { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import 'react-intersection-observer'
import {useInView} from 'react-intersection-observer';
import Button from "react-bootstrap/Button";

import Image from 'next/image'
import alex from '../public/alexcropped.jpg'
import bikes from '../public/horizontalcropped.jpg'
import three from '../public/themcropped.jpg'
import eastside from '../public/eastsidecropped.jpg'

export default function Header (props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const button_style = {
    textAlign: "center",
    fontSize: "min(3vw,35px)",
    marginBottom: "3vw",
    border: "none",
    borderRadius: "30px",
    marginTop: "3vw",

  }

 
  const h1_end_styling = {
    textAlign : "center",
    fontSize: "6vw",
  }
  const home_end_styling = {
    width : "100%",
    height : "20vw",
    backgroundColor : "white",
    textAlign: "center",
    paddingTop: "5vw",
  }
  const h1_styling = {
    transfrom: "translateY(-50%)",
    textAlign : "center",
    paddingTop: "1vw",
    fontSize: "6vw",
  }

  if (!session) {
    return(
    <div id="container">
      <h1 style={h1_styling}>The Bike Center</h1>
      <Body />
      <div style={home_end_styling}>
        <h1 style={h1_end_styling}>Sign Up To Become A Part Of Our Mission!</h1>
        <div>


          <Link href="/api/auth/signin"><Button style={button_style} variant="primary">Become A Volunteer</Button></Link>
        </div>
      </div>
    </div>   
    )
  }
  return(
    <div id="container">
      <h1 style={h1_styling}>The Bike Center</h1>
      <Body />
    </div>
  )
};

const Body = () => {

  const {ref: animation1, inView: isInView1} =  useInView();
  const {ref: animation2, inView: isInView2} =  useInView();
  const {ref: animation3, inView: isInView3} =  useInView();
  const {ref: animation4, inView: isInView4} =  useInView();

   const home2_styling = {
    width : "100%",
    height : "35vw",
    backgroundColor : "white",
  }
  const home3_styling = {
    width : "100%",
    height : "35vw",
    backgroundColor : "#f5f5f5",
  }
  const home4_styling = {
    width : "100%",
    height : "35vw",
    backgroundColor : "white",
  }
  const home5_styling = {
    width : "100%",
    height : "35vw",
    backgroundColor : "#f5f5f5",
  }

  const h2_styling = {
    fontSize : "max(3vw, 20px)",
  }
  const h4_styling = {
    fontSize : "max(2vw, 10px)",
    fontWeight: "300",
  }
  const home_text_left = {
    paddingTop: "3vw",
    float: "left",
    width: "50%",
    paddingLeft: "5%",
    paddingRight: "5%",
  }
  const home_text_right = {
    paddingTop: "3vw",
    float: "right",
    width: "50%",
    paddingRight: "5%",
    paddingLeft: "5%",
  }
  const home_image_right = {
    float: "right",
    paddingRight: "10vw",
    paddingLeft: "5vw",
    paddingTop: "3vw",
  }
  const home_image_left = {
    float: "left",
    marginLeft: "10vw",
    paddingRight: "15vw",
    marginTop: "4vw",
  }
  const img_container_right =  {
    marginRight: "3vw",
    paddingTop: "3vw",
    marginLeft: "10vw",
  }
  
  const img_container_left =  {
    marginLeft: "3vw",
    paddingTop: "3vw",
    marginRight: "10vw",
  }

  return(
    <div id="container">
      <div ref = {animation1} id ="homestyle" className = {isInView1? 'fadeIn' : 'noFade'} style={home2_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>How It Works</h2>
          <h4 style={h4_styling}>If you need your bike transported to a nearby donation location please
          navigate to the <Link href="/map"><a>map</a></Link> page and select a volunteer near you. Click on their
          icon and press the request pickup button and fill out the form. The volunteer will then contact you to schedule a pickup.</h4>
        </div>
        <div style = {img_container_right}>
          <Image layout="responsive" style={home_image_right} width={400} height={200} alt="Bike Image 1"  src={bikes}/>
        </div>
      </div>
      <div ref = {animation2} id ="homestyle" className = {isInView2? 'fadeIn' : 'noFade'} style={home3_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>About Us</h2>
          <h4 style={h4_styling}>This organization started in the Summer of 2021 where we
          started collecting bikes from our neighbors to donate to Bike Works. We wanted to expand our
          work beyond just our neighborhood which is why we created The Bike Center.</h4>
        </div>
        <div style={img_container_left}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 2" style={home_image_left} src={alex}/>
        </div>
      </div>
      <div ref = {animation3} id ="homestyle" className = {isInView3? 'fadeIn' : 'noFade'} style={home4_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Our Mission</h2>
          <h4 style={h4_styling}>Our goal at The Bike Center is to make the bike donation process as easy as possible
          for donors in hopes of encouraging more bike donations. We plan to do this by creating a network of volunteers
          that will transport the bike to the donation location so that people who have bikes but no means of transportation
          can still help out the community. </h4>
        </div>
        <div style = {img_container_right}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 3" style={home_image_right} src={three}/>
        </div>
      </div>
      <div ref = {animation4} id ="homestyle" className = {isInView4? 'fadeIn' : 'noFade'} style={home5_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>How You Can Help</h2>
          <h4 style={h4_styling}>We are looking to expand our network of volunteers so if you are interested in
          helping out your community by providing bikes to the people who need them most, please consider&nbsp;
          <Link href="/volunteer"><a>becoming a volunteer</a></Link> to help transport bikes for people near you.</h4>
        </div>
        <div style={img_container_left}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 4" style={home_image_left} src={eastside}/>
        </div>
      </div>
    </div>
  )
}

