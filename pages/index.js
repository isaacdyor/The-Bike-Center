import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import 'react-intersection-observer'
import {useInView} from 'react-intersection-observer';

import Image from 'next/image'
import img1 from '../public/img1.jpg'
import img2 from '../public/img2.jpg'
import img3 from '../public/img3.jpg'
import img4 from '../public/img4.jpg'

export default function Header (props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const button_style = {
    textAlign: "center",
    width: "max(25vw,200px)",
    height: "70px",
    fontSize: "min(3vw,35px)",
    marginBottom: "3vw",
    border: "none",
    borderRadius: "30px",
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/963/87/601/light-blue-background-hd-wallpaper-wallpaper-preview.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 200%",
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

  if (!session) {
    return(
    <div id="container">
      <Body />
      <div style={home_end_styling}>
        <h1 style={h1_end_styling}>Sign Up To Become A Part Of Our Mission!</h1>
        <div>
          <Link href="/api/auth/signin"><button style={button_style}>Become A Volunteer</button></Link>
        </div>
      </div>
    </div>   
    )
  }
  return(
    <div id="container">
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
          <h2 style={h2_styling}>Cool Blurb One</h2>
          <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div style = {img_container_right}>
          <Image layout="responsive" style={home_image_right} width={400} height={200} alt="Bike Image 1"  src={img1}/>
        </div>
      </div>
      <div ref = {animation2} id ="homestyle" className = {isInView2? 'fadeIn' : 'noFade'} style={home3_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Two</h2>
          <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div style={img_container_left}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 2" style={home_image_left} src={img2}/>
        </div>
      </div>
      <div ref = {animation3} id ="homestyle" className = {isInView3? 'fadeIn' : 'noFade'} style={home4_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Cool Blurb Three</h2>
          <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div style = {img_container_right}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 3" style={home_image_right} src={img3}/>
        </div>
      </div>
      <div ref = {animation4} id ="homestyle" className = {isInView4? 'fadeIn' : 'noFade'} style={home5_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Four</h2>
          <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div style={img_container_left}>
          <Image layout = "responsive" width={400} height={200} alt="Bike Image 4" style={home_image_left} src={img4}/>
        </div>
      </div>
    </div>
  )
}

