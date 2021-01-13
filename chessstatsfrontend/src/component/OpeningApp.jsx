import React, { Component } from 'react';
import PlayerStatsComponent from './PlayerStatsComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import OpeningDetails from './OpeningDetails';

class OpeningApp extends Component {
    render () {
        return (
            <Router>
                <>
                <h1> Opening stats </h1>
                <Switch>
                    <Route path="/" exact component={PlayerStatsComponent} />
                    <Route path="/opening/stats/:name" component={OpeningDetails} />
                </Switch>
                </>
            </Router>
        )
    }
}

export default OpeningApp