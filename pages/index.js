import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import 'react-intersection-observer'
import {useRef, useEffect, useState} from 'react';
import {useInView} from 'react-intersection-observer';
import { NonceProvider } from 'react-select';
import Image from 'next/image'



export default function Header (props) {
  const router = useRouter();
  const { data: session, status } = useSession();

 
  //fade animation
  const {ref: animation1, inView: isInView1} =  useInView();
  const {ref: animation2, inView: isInView2} =  useInView();
  const {ref: animation3, inView: isInView3} =  useInView();
  const {ref: animation4, inView: isInView4} =  useInView();

  //Home Page Styling

  const home1_styling = {
    width : "100%",
    height : "40vw",
    backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/963/87/601/light-blue-background-hd-wallpaper-wallpaper-preview.jpg')",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  }
  const gif_styling = {
    width : "85vw",
    height : "25vw",
    paddingLeft: "15vw",
    textAlign:"center",

  }
  const h1_styling = {
    transfrom: "translateY(-50%)",
    textAlign : "center",
    paddingTop: "5vw",
    fontSize: "6vw",
  }
  const h1_end_styling = {
    textAlign : "center",
    fontSize: "6vw",
  }
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
  const home_end_styling = {
    width : "100%",
    height : "20vw",
    backgroundColor : "white",
    textAlign: "center",
    paddingTop: "5vw",
  }
  const h2_styling = {
    fontSize : "max(3vw, 20px)",
  }
  const h4_styling = {
    fontSize : "max(2vw, 10px)",
    fontWeight: "300",
  }
  const home_text_left = {
    float: "left",
    width: "50%",
    paddingLeft: "10%",
  }
  const home_text_right = {
    float: "right",
    width: "50%",
    paddingRight: "10%",
  }
  const home_image_right = {
    float: "right",
    width: "40%",
    height: "40%",
    paddingRight: "10%",
    paddingTop: "5%",
  }
  const home_image_left = {
    float: "left",
    width: "40%",
    height: "40%",
    paddingLeft: "10%",
    paddingTop: "5%",
  }
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
    position: "relative",
    marginRight: "35vw",
  }
  const arrow_gif = {
    marginTop: "-7vw",
    marginLeft: "18vw",
    float: "left",
    width: "15vw",
  }

  if (!session) {
    return(
    <div id="container">
      <div className="homestyle" style={home1_styling}>
        <h1 style={h1_styling}>The Bike Center</h1>
        <Image src="https://bicyclensw.org.au/wp-content/uploads/2019/09/757-0919-Bicycle-NSW-Rolling-bike-Orange.gif" width={1000} height={1000} style={gif_styling}/>
      </div>
      <div ref = {animation1} id ="homestyle" className = {isInView1? 'fadeIn' : 'noFade'} style={home2_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Cool Blurb One</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_right} src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?h=1000&w=1500&fit=crop&markalign=center%2Cmiddle&txt=pexels.com&txtalign=center&txtsize=60&txtclr=eeffffff&txtfont=Avenir-Heavy&txtshad=10&mark=https%3A%2F%2Fassets.imgix.net%2F~text%3Ftxtclr%3Dfff%26txtsize%3D120%26txtpad%3D20%26bg%3D80000000%26txtfont%3DAvenir-Heavy%26txtalign%3Dcenter%26w%3D1300%26txt%3DFree%2520Stock%2520Photos"/>
        </div>
      </div>
      <div ref = {animation2} id ="homestyle" className = {isInView2? 'fadeIn' : 'noFade'} style={home3_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Two</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_left} src="https://images.pexels.com/photos/71104/utah-mountain-biking-bike-biking-71104.jpeg"/>
        </div>    
      </div>
      <div ref = {animation3} id ="homestyle" className = {isInView3? 'fadeIn' : 'noFade'} style={home4_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Cool Blurb Three</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_right} src="https://images.pexels.com/photos/2943358/pexels-photo-2943358.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"/>
        </div>
      </div>
      <div ref = {animation4} id ="homestyle" className = {isInView4? 'fadeIn' : 'noFade'} style={home5_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Four</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_left} src="https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
        </div>
      </div>
      <div style={home_end_styling}>
        <h1 style={h1_end_styling}>Sign Up To Become A Part Of Our Mission!</h1>
        <Image width={1000} height={1000} style={arrow_gif} src="https://i.pinimg.com/originals/44/67/ce/4467ceda95866abb6e9060609fc81360.gif"/>
        <Link href="/api/auth/signin"><button style={button_style}>Become A Volunteer</button></Link>
      </div>
    </div>   
    )
  }
  return(
    <div id="container">
      <div className="homestyle" style={home1_styling}>
        <h1 style={h1_styling}>The Bike Center</h1>
        <Image width={1000} height={1000} src="https://bicyclensw.org.au/wp-content/uploads/2019/09/757-0919-Bicycle-NSW-Rolling-bike-Orange.gif" style={gif_styling}/>
      </div>
      <div ref = {animation1} id ="homestyle" className = {isInView1? 'fadeIn' : 'noFade'} style={home2_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Cool Blurb One</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_right} src="https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?h=1000&w=1500&fit=crop&markalign=center%2Cmiddle&txt=pexels.com&txtalign=center&txtsize=60&txtclr=eeffffff&txtfont=Avenir-Heavy&txtshad=10&mark=https%3A%2F%2Fassets.imgix.net%2F~text%3Ftxtclr%3Dfff%26txtsize%3D120%26txtpad%3D20%26bg%3D80000000%26txtfont%3DAvenir-Heavy%26txtalign%3Dcenter%26w%3D1300%26txt%3DFree%2520Stock%2520Photos"/>
        </div>
      </div>
      <div ref = {animation2} id ="homestyle" className = {isInView2? 'fadeIn' : 'noFade'} style={home3_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Two</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_left} src="https://images.pexels.com/photos/71104/utah-mountain-biking-bike-biking-71104.jpeg"/>
        </div>    
      </div>
      <div ref = {animation3} id ="homestyle" className = {isInView3? 'fadeIn' : 'noFade'} style={home4_styling}>
        <div style={home_text_left}>
          <h2 style={h2_styling}>Cool Blurb Three</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_right} src="https://images.pexels.com/photos/2943358/pexels-photo-2943358.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"/>
        </div>
      </div>
      <div ref = {animation4} id ="homestyle" className = {isInView4? 'fadeIn' : 'noFade'} style={home5_styling}>
        <div style={home_text_right}>
          <h2 style={h2_styling}>Cool Blurb Four</h2>
            <h4 style={h4_styling}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pulvinar arcu at urna mattis tempor. Morbi quis ante at risus pellentesque finibus vel eget risus. Nullam at elementum erat, nec tempus velit. Nam ac lorem massa.</h4>
        </div>
        <div>
          <Image width={1000} height={1000} style={home_image_left} src="https://images.pexels.com/photos/1149601/pexels-photo-1149601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"/>
        </div>
      </div>
    </div>
  )
};