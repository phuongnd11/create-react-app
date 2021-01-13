import React, { Component } from 'react';
import PlayerStatsDataService from '../service/PlayerStatsDataService';

class OpeningDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mistakes: [],
            foundMistakes: false
        }
        this.getMistakes = this.getMistakes.bind(this);
    }

    getMistakes(playerUsername, openingName) {
        this.setState({isLoading: true});
        PlayerStatsDataService.fetchOpeningMistakes(playerUsername, openingName)
            .then(
                response => {
                    console.log(response);
                    this.setState({
                        mistakes: response.data,
                        foundMistakes: true,
                        isLoading: false
                    })
                }
            );
        //var board1 = Chessboard('board1', 'start');    
    }

    render() {
        return (
            <div className="container">
            <h3>Game links</h3>
                <div className="container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Games</th>    
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.location.state.gameIds.map(
                                    gameId =>
                                        <tr key={gameId}>
                                            <td>
                                                <a href={gameId} target="_blank">
                                                    {gameId}
                                                </a>                                          
                                            </td>                               
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                    <button className="btn btn-success" onClick={() => this.getMistakes(this.props.location.state.playerUsername, 
                        this.props.location.state.name)}>{
                            this.state.isLoading ? "Analyzing.." : "Show mistakes"
                        }</button>
                    <div id="board1" style={{width: '400px'}}></div>
                    {this.state.foundMistakes && 
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>FEN</th>
                                <th>UserMove</th>
                                <th>ComputerMove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.mistakes.map(
                                    mistake =>
                                        <tr key={mistake.fen}>
                                            <td>
                                                <a href={"https://lichess.org/analysis/standard/" + mistake.fen} target="_blank">
                                                    {mistake.fen}
                                                </a>    
                                            </td>
                                            <td>{mistake.userMove}</td>
                                            <td>{mistake.computerMove}</td>
                                        </tr>
                                )
                            }
                        </tbody>
                    </table>
                }    
                </div>          
            </div>
        )
    }
}

export default OpeningDetails
