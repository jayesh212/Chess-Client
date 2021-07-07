import React, { useState } from "react";
import Home from "./components/HomePage/Home";
import WaitingArea from "./components/WaitingArea/WaitingArea";
import Game from "./Game";
const App = () => {
  const [page, setPage] = useState('Home');
  const [player, setPlayer] = useState('WHITE');
  const [gameCode, setGameCode] = useState('');
  const gameCreated = (gameCode) => {
    setPlayer('WHITE');
    setPage('Waiting');
    setGameCode(gameCode);
  }
  const gameJoined = (gameCode) => {
    setPlayer('BLACK');
    setPage('Game');
    setGameCode(gameCode);
  }
  const gameStarted = () => {
    setPage('Game');
  }
  const onGameOver = () => {
    setPage('Home');
  }
  return (
    <div>
      {page === "Home" && <Home gameCreated={gameCreated} gameJoined={gameJoined} />}
      {page === "Waiting" && <WaitingArea onGameStart={gameStarted} onGameOver={onGameOver} gameCode={gameCode}/>}
      {page === "Game" && <Game player={player} gameCode={gameCode} onGameOver={onGameOver}/>}
    </div>
  );
};
export default App;