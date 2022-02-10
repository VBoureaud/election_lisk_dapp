import { transactions } from '@liskhq/lisk-client';
import React, { useState } from 'react';
import * as api from '../api.js';

import {
	moduleElectionId,
	voteAssetId,
} from '../config';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';

const AddVote = () => {
    const [state, updateState] = useState({
        transaction: {},
        response: {},
        error: '',
    });

    const handleSubmit = async event => {
			event.preventDefault();
			let client, res, error, tx;
			const formData = new FormData(event.currentTarget);
			
			// check validity
			if (!formData.get('nameCandidate') ||
				!formData.get('fee') ||
				!formData.get('passphrase')) {
				error = 'Some fields are empty.'
			} else if (isNaN(formData.get('fee'))) {
				error = 'Fee must be a BigInt.'
			}

			if (!error) {
				client = await api.getClient();
	      if (client) {
		      try {
			      tx = await client.transaction.create({
		          moduleID: moduleElectionId,
		          assetID: voteAssetId,
		          fee: BigInt(transactions.convertLSKToBeddows(formData.get('fee'))),
		          asset: {
		              name: formData.get('nameCandidate'),
		          },
			      }, formData.get('passphrase'));
			      if (tx && client.transaction)
		        	res = await client.transaction.send(tx);
		      } catch (errorRes) {
		      	error = errorRes.message;
		      }
		    }
	    }

      updateState({
        transaction: client && client.transaction && tx ? client.transaction.toJSON(tx) : {},
        response: res ? res : {},
        error,
      });
		}

    return (
    	<Container maxWidth="lg">
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              mt: 5,
              mb: 2,
              overflow: 'scroll'
            }}
          >
            <Typography variant="h5">Add a vote</Typography>
            
            {state.error && <Alert severity="error">{state.error}</Alert>}
            <Box 
              component="form"
              onSubmit={handleSubmit}
              noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="nameCandidate"
                label="Name Candidate"
                name="nameCandidate"
                autoComplete="nameCandidate"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="fee"
                label="Fee"
                name="fee"
                autoComplete="fee"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="passphrase"
                label="Passphrase"
                name="passphrase"
                autoComplete="passphrase"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send Transaction
              </Button>
          	</Box>

          	<Divider />
          	<Typography sx={{ mt: 2 }} variant="h5">Result:</Typography>
						<pre>Transaction: {JSON.stringify(state.transaction, null, 2)}</pre>
						<pre>Response: {JSON.stringify(state.response, null, 2)}</pre>
          </Paper>
        </Grid>
      </Container>
    );
}
export default AddVote;
