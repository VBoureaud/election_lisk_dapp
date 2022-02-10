import React, { Component } from 'react';
import {
  fetchCandidateCounter,
  fetchVoteCounter,
  fetchElection,
} from '../api.js';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import { getRandomInt } from '../utils';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 1
      }
    }
  }
};


class Home extends Component {
    constructor(props) {
      super(props);

      this.state = {
        candidateCounter: 0,
        voteCounter: 0,
        election: null,
      };
    }

    buildChartData(election) {
      if (!election) return { labels: [] };
      const randColors = election.voteCount.map(e => [ getRandomInt(255), getRandomInt(255), getRandomInt(255) ]);
      const data = ({
        labels: election.candidates,
        datasets: election.voteCount.map((candidateVote, index) => ({
            'label': election.candidates[index],
            'data': election.voteCount.map((current, cIndex) => cIndex === index ? candidateVote : 0),
            'backgroundColor': 'rgba(' + randColors[index].join(',') + ')',
          }))
      });
      return data;
    }

    async componentDidMount() {
        const candidateCounter = await fetchCandidateCounter();
        const voteCounter = await fetchVoteCounter();
        const election = await fetchElection();

        this.setState({
          candidateCounter: candidateCounter ? candidateCounter : 0,
          voteCounter: voteCounter ? voteCounter : 0,
          election,
        });
    }

    render() {
        return (
          <Container maxWidth="lg">
            <Grid item xs={12} md={8} lg={9}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  mt: 5,
                  mb: 3
                }}
              >
                <Typography variant="h4"sx={{ mb: 2, textAlign: 'center' }}>Election dApp</Typography>
                {!this.state.election && <CircularProgress sx={{ margin: 'auto' }} />}
                {this.state.election && <Bar options={options} data={
                  this.buildChartData(this.state.election)
                } />}
                <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', mt: 4, mb: 2 }}>
                  <Typography variant="subtitle2">Candidate{this.state.election && this.state.election.voteCount.length > 0 ? 's' : ''}:</Typography>
                  <Typography variant="h4">{this.state.candidateCounter}</Typography>
                  <Divider orientation="vertical" flexItem />
                  <Typography variant="subtitle2">Total Vote{this.state.election && this.state.election.voteCount.length > 0 ? 's' : ''}:</Typography>
                  <Typography variant="h4">{this.state.voteCounter}</Typography>
                </Container>
              </Paper>
            </Grid>
                
          </Container>
        );
    }
}

export default Home;
