/**
 * ************************************
 *
 * @module  LandingPage.tsx
 * @author
 * @date
 * @description start page of app, allows to choose between GCP or AWS as a source of clusters to visualize
 *
 * ************************************
 */

import React, { useState, useEffect, useContext } from 'react';
import UploadPage from './UploadPage';
import UploadPage2 from './UploadPage2';
import { StoreContext } from '../../../store';

const LandingPage = () => {
  const [Store, setStore] = useContext(StoreContext);

  // function to get to the Google Cloud Platform upload page
  const myFunctionG = () => {
    console.log(Store.landingPageState);
    setStore({...Store, landingPageState: true});
  }

  // function to get to the Amazon Web Services upload page
  const myFunctionA = () => {
    console.log(Store.landingPageState2);
    setStore({...Store, landingPageState2: true});
  }

  // if landingPageState is true, render UploadPage
  // else if landingPageState2 is true, render UploadPage2
  // else render main landing page
  return (
    <div>
      {Store.landingPageState ? <UploadPage /> :
        Store.landingPageState2 ? <UploadPage2/> :
        <div className='mainDiv'>
          <div><img className='kubLogo' src={require('../assets/credsPage/kub.png')}/></div>
          <div className='text'> KuberOptic: The Kubernetes Visualizer </div>
          <img className='logo' src={require('../assets/credsPage/aws.png')} onClick={myFunctionA}/>
          <img className='logo2' src={require("../assets/credsPage/google.png")} onClick={myFunctionG}/>
        </div>
      }
    </div>
  )
}


export default LandingPage;
