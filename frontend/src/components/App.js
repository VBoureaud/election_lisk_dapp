import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Home from './Home';
import AddCandidate from './AddCandidate';
import AddVote from './AddVote';
import AppBar from './AppBar';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

export const app = () => {
    return (
        <Router>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                justifyContet: 'center',
                height: '100vh',
                overflow: 'auto',
              }}
            >
              <AppBar />
              <Container maxWidth="lg">
                  <Switch>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route path="/add-candidate">
                        <AddCandidate />
                    </Route>
                    <Route path="/add-vote">
                        <AddVote />
                    </Route>
                  </Switch>
              </Container>
            </Box>
        </Router>
    );
}

export default app;
