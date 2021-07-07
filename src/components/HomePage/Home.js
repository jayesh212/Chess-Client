import React, { useState } from 'react';
import './Home.css';

const Home = ({ gameJoined, gameCreated }) => {
    const joinGameHandler = () => {
        //Check the validity of the game code
        if (globalError.length !== 0) setGlobalError("");
        var gameCodeInt = parseInt(gameCode);
        if (gameCodeInt < 0) {
          setGameJoinError(
            "Game Code Must Be 6 digits long and greater than 0"
          );
          return;
        }
        if (gameCode.length < 6)
        {
            setGameJoinError('Game Code Must have 6 digits');
            return;
        }
        fetch("https://jayschessserver.herokuapp.com/joinGame", {
          method: "POST",
          headers: {
            "content-Type": "application/x-www-form-urlencoded",
          },
          body: `gameCode=${gameCode}`,
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJSON) => {
            if (responseJSON.error) {
              //Show Some Error
              setGameJoinError(responseJSON.error);
            } else {
              gameJoined(gameCode);
            }
          })
          .catch((error) => {
            setGlobalError("Server is Temporarily Down");
          });
    }
    const createGameHandler = () => {
        if (globalError.length !== 0) setGlobalError("");
        fetch("https://jayschessserver.herokuapp.com/createGame", {
          method: "POST",
          headers: {
            "content-Type": "application/x-www-form-urlencoded",
          },
          body: "",
        })
          .then((response) => {
            return response.json();
          })
          .then((responseJSON) => {
            if (responseJSON.error) {
              //Show The Error
              setGlobalError(responseJSON.error);
            } else {
              //Move to Waiting Area
              gameCreated("" + responseJSON.gameCode);
            }
          })
          .catch((error) => {
            setGlobalError("Server is Temporarily Down");
          });
    }
    const onCodeChange = (ev) => {
        if (globalError.length !== 0) setGlobalError("");
        setGameCode(ev.target.value);
        setGameJoinError('');
    }
    const onJoinGameClicked = () => {
        if(globalError.length!==0)setGlobalError('');
        if (gameMode === 'create') setGameMode('join');
        else setGameMode('create');
  }
    const [gameCode, setGameCode] = useState('');
    const [gameMode, setGameMode] = useState('create');
    const [gameJoinError, setGameJoinError] = useState('');
    const [globalError, setGlobalError] = useState('');
    return (
      <div className="gameMenu">
        <button className="menuButton" onClick={createGameHandler}>
          Create Game
        </button>

        <button className="menuButton" onClick={onJoinGameClicked}>
          Join Game
        </button>
        {gameMode === "join" && (
          <div className="joinGame">
            <input value={gameCode} id = 'gameCodeInput' type="number" onChange={onCodeChange} />
            {gameJoinError.length !== 0 && (
              <p className="error">{gameJoinError}</p>
            )}
            <button onClick={joinGameHandler} className="menuButton">
              Join
            </button>
          </div>
        )}
        <br />
            <br />
        {globalError.length !== 0 && <p className="error">{globalError}</p>}
      </div>
    );
}
export default Home;