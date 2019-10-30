/**
 * ************************************
 *
 * @module  gcpDeploy.tsx
 * @author
 * @date
 * @description page to determine deployment settings? Possibly making a post-style request to GCP to create a cluster
 *
 * ************************************
 */

import * as React from 'react';
import { useContext } from 'react';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import {StoreContext} from '../../../store'
const [quickstart, create] = require('../../main/gcp/getGCPdata').default
const { ipcRenderer } = require('electron');

require('events').EventEmitter.defaultMaxListeners = 25;
import GetGCP from './GcpGetClusters';

// Material-UI uses "CSS in JS" styling
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    // root: { // currently not being used - maybe delete later
    //   display: 'flex',
    //   // flexGrow: 1
    // },
    text: { 
      align: 'center',
      margin: '10px 0 20px 0', // will adjust later
    },
    button: {
      margin: theme.spacing(1),
    },
    textField: {
      width: "100%",
    },
  }),
);

// various inputs will be stored in this object and will be submitted when you call handleSubmit
let deployVals = {};

const gcpDeploy = () =>{
  const [Store, setStore] = useContext(StoreContext);

  const handleName = (event) => {
    deployVals['name'] = event.currentTarget.value;
  }
  const handleType = (event) => {
    deployVals['clusterType'] = event.currentTarget.value;
  }
  const handleNodeCount = (event) => {
    deployVals['count'] = event.currentTarget.value;
  }
  const handleLoc = (event) => {
    const location = event.currentTarget.value
    // setStore({...Store, gcploc: location})
    deployVals['zone'] = location;
  }
  const handleBack = () => {
    // const mainCanvas = document.getElementById('leCanvas');
    // if (mainCanvas.hasChildNodes()) {
    //   while (mainCanvas.children.length > 8) {
    //   while (mainCanvas.hasChildNodes()) {
    //     let child = mainCanvas.firstChild
    //     if (child == null) break;
    //     else {
    //     console.log('child element deleted on back is... ', child)
    //     mainCanvas.removeChild(child);
    //     }
    //   }
    // }

    return setStore({
      ...Store,
      uploadPageState:false, 
      gcpDeployPage:false,
      credentials: null,
      clusterCount: 0,
      clusters: [],
      visualize: false,
      gcploc: {
        'us-central1-a': false,
        'us-central1-b': false,
        'us-central1-c': false,
        'us-west1-a': false,
        'southamerica-east1-a': false,
        'southamerica-east1-b': false,
        'southamerica-east1-c': false,
        'europe-west2-a': false
      }
    });
  }
  const handleDeploy = () =>{
    create(Store.credentials, deployVals['zone'], deployVals)
    const creds = JSON.parse(Store.credentials)
    ipcRenderer.send('getNewClusters', creds, deployVals['zone']);
    setStore({...Store,
      gcpDeployPage:false,
      deploying: true,
      clusters: [],
      clusterCount: 0,
      visualize: false
    })
  }

  ipcRenderer.on('newClusters', (event: any, singleArr: any) => {
    //logic incase we have more than one cluster already rendered
    if(Store.clusterCount) {
      let newClusters = Store.clusters.concat(singleArr);
      newClusters = Object.values(newClusters.reduce((allClusts, nextClust) => Object.assign(allClusts, { [nextClust.clusterName] : nextClust}), {}))
      setStore({...Store,
        clusters: newClusters,
        clusterCount: newClusters.length,
        deploying: false, 
        gcpDeployPage: true,
        visualize: true
       })
       event.returnValue = 'done';
    } else {
      setStore({...Store,
        clusters: singleArr,
        clusterCount: singleArr.length,
        deploying: false, 
        gcpDeployPage: true,
        visualize: true
       })
    }
    event.returnValue = 'done';
  })

  const classes = useStyles(); // this is showing an error but this is directly from Material-UI and is fine

  return (
    // <div id="deployWrapper">
    <div>
      <GetGCP/>
      <br/>
      <Divider />
      
      <Grid container direction="column" justify="space-around" alignItems="center">
      {/* <div className="inputPageDeploy"> */}
        {/* <h3 className="deployTitle">Deploy New GCP Cluster:</h3> */}

        <Typography className={classes.text} variant="h5">
          Deploy New GCP Cluster:
        </Typography>

        {/* <input id="deployClustName" 
        name="name"
        className='clusterType' 
        type="text" 
        onChange={handleName} 
        placeholder="cluster name" 
        required={true}></input> */}

        {/* figure out why formatting of text field is weird */}
        <form noValidate autoComplete="off"> 
          <TextField
            id="deploy-gcp-cluster-name"
            label="Input cluster name"
            className={classes.textField}
            margin="normal"
            onChange={handleName} // check to make sure if this works
          />
        </form>

        <div id="deployDropDowns">
          <select id="deployChooseClustType" className='clusterType' onChange={handleType}>
          <option selected>Cluster type</option>
          <option value='affordable'>affordable</option>
          <option value='standard'>standard</option>
          <option value='cpuIntensive'>cpuIntensive</option>
          <option value='memoryIntensive'>memoryIntensive</option>
          <option value='gpuAcceleratedComputing'>gpuAcceleratedComputing</option>
          <option value='highly available'>highly available</option>
          </select>

          <select id='nodeCounter' className='clusterType' onChange={handleNodeCount}>
          <option selected># of Nodes</option>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
          </select>
        </div>

        <div className="deployLocTitle">
          {/* <h3 className="deployTitle">Deploy Location</h3> */}

          {/* maybe add a className here */}
          <Typography variant="h6"> 
            Deploy Location
          </Typography>

          <form className="nodeLocationRadios">
            <div className="div1">
              <label>  
              <input type="radio" name="location" value="us-central1-a" onChange={handleLoc}></input>
                US Central (1A)
              </label>
            </div>
            <div className="div2">
              <label>  
              <input type="radio" name="location" value="us-central1-b" onChange={handleLoc}></input>
                US Central (1B)
              </label>
            </div>
            <div className="div3">
              <label>  
              <input type="radio" name="location" value="us-central1-c" onChange={handleLoc}></input>
                US Central (1C)
              </label>  
            </div>
            <div className="div4">
              <label>  
              <input type="radio" name="location" value="us-west1-a" onChange={handleLoc}></input>
                US West (1A)
              </label>
            </div>
            <div className="div5">
              <label>  
              <input type="radio" name="location" value="southamerica-east1-a" onChange={handleLoc}></input>
                S.America East (1A)
              </label>
            </div>
            <div className="div6">
              <label>  
              <input type="radio" name="location" value="southamerica-east1-b" onChange={handleLoc}></input>
                S.America East (1B)
              </label>
            </div>
            <div className="div7">
              <label>  
              <input type="radio" name="location" value="southamerica-east1-c" onChange={handleLoc}></input>
                S.America East (1C)
              </label>
            </div>
            <div className="div8">
              <label>  
              <input type="radio" name="location" value="europe-west2-a" onChange={handleLoc}></input>
                Europe West (2A)
              </label>
            </div>
          </form> 
        </div>


          {/* <div id='buts'> */}
            {/* <button id="deploySubmit" className='uploadButtD' onClick={handleDeploy}> Deploy </button> */}
            {/* <button id="deployBack" className = 'uploadButtD' onClick={handleBack}>  Back  </button> */}
          {/* </div> */}

        <Button variant="contained" color="primary" className={classes.button} onClick={handleDeploy}>
          Deploy
        </Button>

        <Button variant="outlined" color="primary" className={classes.button} onClick={handleBack}>
          Return Home
        </Button>
      {/* </div> */}
      </Grid>
    </div>
  )
}

export default gcpDeploy;
