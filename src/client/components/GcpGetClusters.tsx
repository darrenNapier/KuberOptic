/**
 * ************************************
 *
 * @module  GcpGetClusters.tsx
 * @author
 * @date
 * @description upload page for clusters from Google Cloud Platform
 *
 * ************************************
 */

import * as React from 'react';
import { useContext } from 'react';
import { StoreContext } from '../../../store';
import Checkbox from './subcomponents/Checkbox';
import { Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const { ipcRenderer } = require('electron');
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
      margin: '10px 0 20px 0', // will adjust later
    },
    textField: {
      width: "100%",
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);

// style elements no longer being used:
// className="deployTitle"

const GcpGetClusters = () => {
  const [Store, setStore] = useContext(StoreContext);
  // function for handling location changes as boxes are checked
  const handleLocation = (location: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // updated to account for selecting multiple locations
    const newGcpLoc = Store.gcploc;
    newGcpLoc[location] = event.target.checked;
    console.log(newGcpLoc)
    setStore({
      ...Store, 
      gcploc: newGcpLoc,
    });
  }

  const labelsForFrontEnd = [
    'US Central (1A)',
    'US Central (1B)',
    'US Central (1C)',
    'US West (1A)',
    'S.America East (1A)',
    'S.America East (1B)',
    'S.America East (1C)',
    'Europe West (2A)'
  ]

  // making the options of locations to be displayed
  const deployLocationStrings = [
    'us-central1-a',
    'us-central1-b',
    'us-central1-c',
    'us-west1-a',
    'southamerica-east1-a',
    'southamerica-east1-b',
    'southamerica-east1-c',
    'europe-west2-a'
  ];

  // deployLocations is what will be rendered later
  // will be a bunch of checkboxes with text labels
  const deployLocations = [];
  deployLocationStrings.forEach((location, ind) => {
    deployLocations.push(
      <Checkbox 
        checked={Store[location]}
        handleChange={handleLocation}
        value={location}
        label={labelsForFrontEnd[ind]}
        // maybe add a 'className' here, if needed
        // original class name: .loc
      />
    );
  });

  const handleSubmit = () => {
    const creds = JSON.parse(Store.credentials);
    const locations = Store.gcploc;
    const fetchMe = [];

    console.log('building array of locations ----')
    for (let zone in locations) {
      if (locations[zone]) {
        fetchMe.push(zone);
      }
    }
    console.log('array going to main', fetchMe);
    setStore({
      ...Store,
      gcpDeployPage: false,
      clusters: [],
      clusterCount: 0,
      deploying: true, 
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
      },
    });
    console.log(Store)
    ipcRenderer.send('asynchronous-message', creds, fetchMe)
  }

  ipcRenderer.on('clusterClient', (event: any, gcpClusters: any) => {
    console.log('was the store reset?', Store)
    const singleArr = []
    console.log('this is what is coming back from deploying and fetching', gcpClusters)
    for (let item of gcpClusters) {
      if (Array.isArray(item)) {
        item.forEach(clust => singleArr.push(clust));
      }
      else singleArr.push(item);
    }
    if(Store.clusterCount) {
      let newClusters = Store.clusters.concat(singleArr);
      newClusters = Object.values(newClusters.reduce((allClusts, nextClust) => Object.assign(allClusts, { [nextClust.clusterName] : nextClust}), {}))
      setStore({
        ...Store,
        clusters: newClusters,
        clusterCount: newClusters.length,
        visualize: true,
        gcpDeployPage: true,
        deploying: false
      })
      event.returnValue = 'done';
    } else {
      setStore({
        ...Store, 
        clusters: singleArr,
        clusterCount: singleArr.length,
        visualize: true,
        gcpDeployPage: true,
        deploying: false
      })
    }
    event.returnValue = 'done';
  })

  const classes = useStyles(); // this is showing an error but this is directly from Material-UI and is fine

  return (
    <Grid container direction="column" justify="space-around" alignItems="center">
    {/* <div className="getGCPWrapper"> */}
      {/* <h3 className="deployTitle">
        Display GCP Clusters:</h3>  */}

      <Typography className={classes.text} variant="h5">
        Display GCP Clusters:
      </Typography>

      <div id='uploadSelectMenu'>
        {deployLocations}
      </div>

      <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
        Submit
      </Button>

      {/* <div id='buts'>
        <button id="deploySubmit" className='uploadButtD' onClick={handleSubmit}> Fetch </button>
      </div> */}
    {/* </div> */}
    </Grid>
  )
}

export default GcpGetClusters;
