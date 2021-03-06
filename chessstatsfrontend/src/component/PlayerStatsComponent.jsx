import React, { Component } from 'react';
import PlayerStatsDataService from '../service/PlayerStatsDataService';
import FetchQuote from "../service/QuotesFetcher";
import { Route , withRouter} from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';

class PlayerStatsComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            playerStats: [],
            loaded: false,
            overviewFetched: false,
            winrateByDayFetched: false,
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
        this.setState({isLoading: true});
        PlayerStatsDataService.fetchPlayerStats(playerUsername)
            .then(
                response => {
                    console.log(response);
                    this.setState({
                        playerStats: response.data,
                        playerUsername: playerUsername,     
                        loaded: true,
                        isLoading: false
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
        
        PlayerStatsDataService.fetchWinrateByDay(playerUsername)
            .then(
                response => {
                    console.log(response);
                    this.setState({
                        winrateByDay: response.data,
                        winrateByDayFetched: true
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
                                <button className="btn btn-success" type="submit">{this.state.isLoading ? "Analyzing games.." : "Get Stats"
                }</button>  
                            </Form>
                        )
                    }
                </Formik>    
                <FetchQuote/>  
                <p> </p>
                {this.state.overviewFetched && 
                    <p>Games analyzed: {this.state.playerOverview.gamesAnalyzed}</p> 
                }
                {this.state.overviewFetched && 
                    <p>Number of backward moves (in first 30 moves): {this.state.playerOverview.numberOfBackwardMoves}. Average: {
                        this.state.playerOverview.numberOfBackwardMoves/this.state.playerOverview.gamesAnalyzed} backward move per game.</p> 
                }  
                {this.state.winrateByDayFetched && 
                    <p>
                        Winrate by day:
                    </p>
                }  
                {this.state.winrateByDayFetched && 
                    <p>
                        Monday: {this.state.winrateByDay.MONDAY.winRate}% &nbsp;
                        Tuesday: {this.state.winrateByDay.TUESDAY.winRate}% &nbsp;
                        Wednesday: {this.state.winrateByDay.WEDNESDAY.winRate}% &nbsp;
                        Thursday: {this.state.winrateByDay.THURSDAY.winRate}% &nbsp;
                        Friday: {this.state.winrateByDay.FRIDAY.winRate}% &nbsp;
                        Saturday: {this.state.winrateByDay.SATURDAY.winRate}% &nbsp;
                        Sunday: {this.state.winrateByDay.SUNDAY.winRate}% &nbsp;
                    </p>
                } 
                {this.state.overviewFetched && 
                    <p>
                        Winrate by opponent rating: Lower rated - {this.state.playerOverview.winRateByOpponentRating.LOWER_RATED.winRate}% &nbsp;
                        Higher rated - {this.state.playerOverview.winRateByOpponentRating.HIGHER_RATED.winRate}%
                    </p> 
                }   
                {this.state.overviewFetched && 
                    <p>
                        Winrate by castle type: Castle short - {this.state.playerOverview.winRateByCastle.SHORT.winRate}% &nbsp;
                        Castle long - {this.state.playerOverview.winRateByCastle.LONG.winRate}% &nbsp;
                        No castle - {this.state.playerOverview.winRateByCastle.NONE.winRate}% &nbsp;
                    </p> 
                }
                <p> </p>
                {this.state.overviewFetched &&  
                    <p>Opening overview: {this.state.playerOverview.style}</p>
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
                                <th>Black games</th>
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