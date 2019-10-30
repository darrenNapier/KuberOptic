/**
 * ************************************
 *
 * @module  UploadPage.tsx
 * @author
 * @date
 * @description upload page for clusters from Google Cloud Platform
 *
 * ************************************
 */

import * as React from 'react';
import { useContext } from 'react';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { StoreContext } from '../../../store';
import GCPDeploy from './gcpDeploy';
import Deploying from './deploying';
require('events').EventEmitter.defaultMaxListeners = 25;

// Material-UI uses "CSS in JS" styling
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: { // currently not being used - maybe delete later
    //   display: 'flex',
    //   // flexGrow: 1
    // },
    text: {
      align: 'center',
      margin: '0 0 50px 0', // will adjust later
    },
    textField: {
      width: "100%",
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

/*
.uploadDiv { // no longer used
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  margin: 0px auto;
}

.gcpImageContainer{
  box-sizing: border-box;
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.kubUpload {
  /* transform: rotate(360deg); 
  height: 125px;
  width: 175px;
  margin: 10px auto;
  /* margin-top: 60px; 
  /* margin-left: 325px; 
  color: rgb(254, 254, 255);
  /* animation: rotation 1s infinite linear; 
}

.kubUploadText { // no longer used
  height: auto;
  width: 295px;
  margin: 15px auto;
  color: aquamarine;
  text-align: center;
  font-family: 'Amatic SC', cursive;
  font-size: 60px;
}

#uploadDivForSubmitandBackButts { // no longer used
  display: flex;
  flex-direction: column;
}
*/


const UploadPage = () => {
  const [Store, setStore] = useContext(StoreContext);
  
  // this is called every time the input field changes
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => { // was originally React.FormEvent
    setStore({...Store, credentials:e.currentTarget.value});
  };
  
  // functionality for back button
  const handleBack = () => {
    setStore({
      ...Store,
      uploadPageState:false, 
      uploadPageState2:false,
      credentials: null,
      clusterCount: 0,
      clusters: []
    });
  };

  // functionalilty for pressing 'submit' button
  const handleSubmit = () => {
    const creds = JSON.parse(Store.credentials); 
    if (typeof creds !== 'object' || !creds.hasOwnProperty("project_id")) {
      console.log('Enter a JSON object from GCP that includes the project_id key');
      console.log('locStore: ', Store.gcploc)
    }
    else setStore({...Store, gcpDeployPage: true });
  } 
    
  const classes = useStyles(); // this is showing an error but this is directly from Material-UI and is fine

  return (
    <>
      { Store.deploying ? <Deploying/> :
        Store.gcpDeployPage ? <GCPDeploy/> :
        <Grid container direction="column" justify="space-around" alignItems="center">
          <div className="gcpImageContainer">
            <img className='kubUpload' src={require('../assets/credsPage/google.png')}/>

            <Typography className={classes.text} variant="h3">
              Google Cloud Platform
            </Typography>
          </div>

          <form noValidate autoComplete="off">
              <TextField
                id="standard-helperText"
                label="Input GCP Info"
                className={classes.textField}
                helperText="Enter a JSON object from GCP that includes the project_id key"
                margin="normal"
                onChange={handleInput}
              />
          </form>

          <div>
            <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
              Submit
            </Button>

            <Button variant="outlined" color="primary" className={classes.button} onClick={handleBack}>
              Back
            </Button>
          </div>
        </Grid>
      }
    </>
  )
}

export default UploadPage;
