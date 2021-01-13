import React, { Component } from 'react';
import PlayerStatsDataService from '../service/PlayerStatsDataService';
import { Route , withRouter} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class PlayerStatsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            playerStats: [],
            loaded: false,
            overviewFetched: false,
            playerUsername: ""
        }
        this.refreshStats = this.refreshStats.bind(this);
        this.fetchDetails = this.fetchDetails.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    fetchDetails(playerUsername, name, gameIds) {
        console.log('See details: ' + name);
        this.props.history.push({
            pathname: `/opening/stats/${name}`,
            state: {
                name: name,
                playerUsername: playerUsername,
                gameIds: gameIds
            }
        });
    }

    refreshStats(playerUsername) {
        PlayerStatsDataService.fetchPlayerStats(playerUsername)
            .then(
                response => {
                    console.log(response);
                    this.setState({
                        playerStats: response.data,
                        playerUsername: playerUsername,     
                        loaded: true
                    })
                }
            );

        PlayerStatsDataService.fetchOverview(playerUsername)
        .then(
            response => {
                console.log(response);
                this.setState({
                    playerOverview: response.data,
                    overviewFetched: true
                })
            }
        );    
    }

    onSubmit(values) {
        console.log(values);
        this.refreshStats(values.playerUsername);
    }

    render() {
        let { playerUsername } = this.state
        return (
            <div className="container">
                <Formik initialValues={{playerUsername}} onSubmit={this.onSubmit}>
                    {
                        (props) => (
                            <Form>
                                <fieldset className="form-group">
                                    <label>Chess.com username: </label>
                                    <Field className="form-group" type="text" name="playerUsername" />
                                </fieldset>                               
                                <button className="btn btn-success" type="submit">Get stats</button>  
                            </Form>
                        )
                    }
                </Formik>      
                <p> </p>
                {this.state.overviewFetched && 
                    <p>Overview: {this.state.playerOverview.style}</p>
                }  
                <p> </p>
                {this.state.loaded && 
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Opening</th>
                                <th>White won (%)</th>
                                <th>White games</th>
                                <th>Black won (%)</th>
                                <th>Back games</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.playerStats.map(
                                    stat =>
                                        <tr key={stat.name} onClick={() => this.fetchDetails(this.state.playerUsername, stat.name, stat.gameIds)}>
                                            <td>{stat.name}</td>
                                            <td>{stat.totalWhite < 3 ? "-" : stat.winRateAsWhite + "%"}</td>
                                            <td>{stat.totalWhite < 3 ? "-" : stat.totalWhite}</td>
                                            <td>{stat.totalBlack < 3 ? "-" : stat.winRateAsBlack + "%"}</td>
                                            <td>{stat.totalBlack < 3 ? "-" : stat.totalBlack}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                }    
            </div>
        )
    }
    
}

export default withRouter(PlayerStatsComponent)