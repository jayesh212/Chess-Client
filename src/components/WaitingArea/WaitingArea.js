import React, { useEffect } from 'react';
import './WaitingArea.css';
import Loading from './loading.gif';
const checkGameStatus = (gameCode,onStart) => {
  fetch("https://jayschessserver.herokuapp.com/gameStatus", {
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
        console.log(responseJSON.error);
      } else {
        if (responseJSON.status === "started") {
          onStart();
        }
      }
    });
}

var timer;
const WaitingArea = ({ gameCode, onGameStart ,onGameOver}) => {
  useEffect(() => {
    timer = setInterval(checkGameStatus, 4000,gameCode,onGameStart);
    return () => {
      clearInterval(timer);
    };
  }, [gameCode, onGameStart]);
  const onGameLeave = () => {
    //leave the game and move to home
    fetch("https://jayschessserver.herokuapp.com/endGame", {
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
        clearInterval(timer);
        onGameOver();
      })
      .catch((err) => {
        clearInterval(timer);
        onGameOver();
      });
  };
  return (
    <div className='waitingArea'>
      <span className="text">Waiting For Other Player To Join</span>
      <img src={Loading} alt="loading animation" />
      <div>
      <span className="text">Tell Your Friend to Enter </span>
        <span className='goldenText'>{gameCode}</span><span className='text'> While Joining</span>
      </div>
      <button className='menuButton' onClick={onGameLeave}>Leave Game</button>
    </div>
  );
};  
export default WaitingArea;