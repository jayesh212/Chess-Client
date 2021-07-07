import React from 'react';
import ChessBoard from './components/ChessBoard/ChessBoard';
const Game = ({player,gameCode,onGameOver}) => {
    return (
        <div>
            <ChessBoard player={player} gameCode={gameCode} onGameOver={onGameOver} />
        </div>
    );
}
export default Game;
