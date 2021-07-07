import React, { useEffect, useState } from "react";
import "./ChessBoard.css";
import WaitingAnimation from './WaitingAnimation.gif';
import PawnBlack from "./pieces/b_pawn_svg_withShadow.svg";
import PawnWhite from "./pieces/w_pawn_svg_withShadow.svg";
import BishopBlack from "./pieces/b_bishop_svg_withShadow.svg";
import BishopWhite from "./pieces/w_bishop_svg_withShadow.svg";
import RookBlack from "./pieces/b_rook_svg_withShadow.svg";
import RookWhite from "./pieces/w_rook_svg_withShadow.svg";
import KnightBlack from "./pieces/b_knight_svg_withShadow.svg";
import KnightWhite from "./pieces/w_knight_svg_withShadow.svg";
import QueenWhite from "./pieces/w_queen_svg_withShadow.svg";
import QueenBlack from "./pieces/b_queen_svg_withShadow.svg";
import KingWhite from "./pieces/w_king_svg_withShadow.svg";
import KingBlack from "./pieces/b_king_svg_withShadow.svg";
import Timer from '../Timer/Timer';

//const verticalAxis = ['1','2','3','4','5','6','7','8'];
//const horizontalAxis = ['a','b','c','d','e','f','g','h'];
//#e1e2c8   #779556
const BlackPieces = [
  PawnBlack,
  BishopBlack,
  RookBlack,
  KnightBlack,
  QueenBlack,
  KingBlack,
];
const WhitePieces = [
  PawnWhite,
  BishopWhite,
  RookWhite,
  KnightWhite,
  QueenWhite,
  KingWhite,
];
var timer;
var waitForNextMove;
var initBoardPieces = [];
var initHighlighted = [];
const initBoard = () => {
  //Pawns
  var i;
  for (i = 0; i < 64; i++) {
    initBoardPieces[i] = null;
    initHighlighted[i] = false;
  }
  for (i = 8; i <= 15; i++) {
    initBoardPieces[i] = PawnWhite;
  }
  for (i = 48; i <= 55; i++) {
    initBoardPieces[i] = PawnBlack;
  }
  //Rooks
  initBoardPieces[56] = RookBlack;
  initBoardPieces[63] = RookBlack;
  initBoardPieces[0] = RookWhite;
  initBoardPieces[7] = RookWhite;
  //Knight
  initBoardPieces[57] = KnightBlack;
  initBoardPieces[62] = KnightBlack;
  initBoardPieces[1] = KnightWhite;
  initBoardPieces[6] = KnightWhite;
  //Bishop
  initBoardPieces[58] = BishopBlack;
  initBoardPieces[61] = BishopBlack;
  initBoardPieces[2] = BishopWhite;
  initBoardPieces[5] = BishopWhite;
  //Queen
  initBoardPieces[3] = QueenWhite;
  initBoardPieces[59] = QueenBlack;
  //King
  initBoardPieces[4] = KingWhite;
  initBoardPieces[60] = KingBlack;
}
initBoard();
// The Main Component that controls all the game interactions
const ChessBoard = ({ player, gameCode ,onGameOver}) => {
  var squares = [];
  var i, j;
  var selfPieces = [];
  if (player === "WHITE") selfPieces = WhitePieces;
  else selfPieces = BlackPieces;
  const getNextMove = (gameCode, player) => {
    var dataString = `gameCode=${gameCode}&player=${player}`;
    fetch("https://jayschessserver.herokuapp.com/getNextMove", {
      method: "POST",
      headers: {
        "content-Type": "application/x-www-form-urlencoded",
      },
      body: dataString,
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        if (responseJSON.error) {
          console.log(responseJSON.error);
        } else {
          if (responseJSON.status === "Ok") {
            console.log(responseJSON);
            movePiece(
              parseInt(responseJSON.toI),
              parseInt(responseJSON.toJ),
              parseInt(responseJSON.fromI),
              parseInt(responseJSON.fromJ)
            );
            clearInterval(timer);
            waitForNextMove = false;
            setWaitingStatus(false);
          }
        }
      });
  };
  for (i = 0; i < 64; i++) initHighlighted[i] = false;
  const [pieces, setPieces] = useState(initBoardPieces);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState(initHighlighted);
  const [waitingForMove, setWaitingStatus] = useState(false);
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
  useEffect(() => {
    if (player === "BLACK") {
      timer = setInterval(getNextMove, 4000, gameCode, player);
      setWaitingStatus(true);
      return (() => { clearInterval(timer) });
    }
  }, [player, gameCode]);
  useEffect(() => {
    if (player === 'BLACK') waitForNextMove = true;
    else waitForNextMove = false;
  },[player]);
  const movePiece = (toI, toJ, fromI, fromJ) => {
    var piecesTemp = [];
    console.log('Piece Moved');
    for (var t = 0; t < 64; t++) piecesTemp[t] = initBoardPieces[t];
    piecesTemp[toI * 8 + toJ] = piecesTemp[fromI * 8 + fromJ];
    piecesTemp[fromI * 8 + fromJ] = null;
    initBoardPieces[toI * 8 + toJ] = initBoardPieces[fromI * 8 + fromJ];
    initBoardPieces[fromI * 8 + fromJ] = null;
    setPieces(piecesTemp);
  };
  const sendMoveToServer = (toI, toJ, fromI, fromJ) => {
    var dataString = `gameCode=${gameCode}&player=${player}&toI=${toI}&toJ=${toJ}&fromI=${fromI}&fromJ=${fromJ}`;
      fetch("https://jayschessserver.herokuapp.com/movePiece", {
        method: "POST",
        headers: {
          "content-Type": "application/x-www-form-urlencoded",
        },
        body: dataString,
      })
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.error) {
            console.log(responseJSON.error);
          } else if (responseJSON.status === "Ok") {
            clearInterval(timer);
            timer = setInterval(getNextMove, 4000, gameCode, player);
            waitForNextMove = true;
            setWaitingStatus(true);
          }
        });
  };
  const highlightSquares = (piece, id) => {
    var isHighlightedTemp = [];
    var t, k;
    for (t = 0; t < 64; t++) isHighlightedTemp[t] = false;
    if (piece === null) {
      setIsHighlighted(isHighlightedTemp);
      return;
    }
    var locationI = parseInt(id.charAt(0));
    var locationJ = parseInt(id.charAt(2));
    isHighlightedTemp[locationI * 8 + locationJ] = true;
    if (piece === PawnBlack) {
      if (locationI === 6) {
        //Move one position forward
        if (pieces[(locationI - 1) * 8 + locationJ] === null) {
          isHighlightedTemp[(locationI - 1) * 8 + locationJ] = true;
        }
        //Move two position forward
        if (
          pieces[(locationI - 1) * 8 + locationJ] === null &&
          pieces[(locationI - 2) * 8 + locationJ] === null
        ) {
          isHighlightedTemp[(locationI - 2) * 8 + locationJ] = true;
        }
      } else {
        //Move one position forward
        if (
          locationI !== 0 &&
          pieces[(locationI - 1) * 8 + locationJ] === null
        ) {
          isHighlightedTemp[(locationI - 1) * 8 + locationJ] = true;
        }
      }
      // Or take on either side one step forward
      if (
        locationI !== 0 &&
        locationJ !== 0 &&
        pieces[(locationI - 1) * 8 + locationJ - 1] != null &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI !== 0 &&
        locationJ !== 7 &&
        pieces[(locationI - 1) * 8 + locationJ + 1] !== null &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ + 1] = true;
      }
    } else if (piece === KingBlack) {
      if (
        locationJ < 7 &&
        !selfPieces.includes(pieces[locationI * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[locationI * 8 + locationJ + 1] = true;
      }
      if (
        locationJ > 0 &&
        !selfPieces.includes(pieces[locationI * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[locationI * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 7 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ] = true;
      }
      if (
        locationI > 0 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ] = true;
      }
      if (
        locationI > 0 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI > 0 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ + 1] = true;
      }
    } else if (piece === QueenBlack) {
      for (t = locationI + 1, k = locationJ + 1; t <= 7 && k <= 7; t++, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ - 1; t >= 0 && k >= 0; t--, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ + 1; t >= 0 && k <= 7; t--, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1, k = locationJ - 1; t <= 7 && k >= 0; t++, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1; t <= 7; t++) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationI - 1; t >= 0; t--) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationJ + 1; t <= 7; t++) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
      for (t = locationJ - 1; t >= 0; t--) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
    } else if (piece === BishopBlack) {
      for (t = locationI + 1, k = locationJ + 1; t <= 7 && k <= 7; t++, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ - 1; t >= 0 && k >= 0; t--, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ + 1; t >= 0 && k <= 7; t--, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1, k = locationJ - 1; t <= 7 && k >= 0; t++, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
    } else if (piece === KnightBlack) {
      if (
        locationI > 1 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI - 2) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI - 2) * 8 + locationJ - 1] = true;
      }
      if (
        locationI > 1 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI - 2) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI - 2) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 6 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI + 2) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI + 2) * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 6 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI + 2) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI + 2) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ < 6 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ + 2])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ + 2] = true;
      }
      if (
        locationI > 0 &&
        locationJ < 6 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ + 2])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ + 2] = true;
      }
      if (
        locationI < 7 &&
        locationJ > 1 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ - 2])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ - 2] = true;
      }
      if (
        locationI > 0 &&
        locationJ > 1 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ - 2])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ - 2] = true;
      }
    } else if (piece === RookBlack) {
      for (t = locationI + 1; t <= 7; t++) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationI - 1; t >= 0; t--) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationJ + 1; t <= 7; t++) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
      for (t = locationJ - 1; t >= 0; t--) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
    } else if (piece === PawnWhite) {
      if (locationI === 1) {
        //Move one position forward
        if (pieces[(locationI + 1) * 8 + locationJ] === null) {
          isHighlightedTemp[(locationI + 1) * 8 + locationJ] = true;
        }
        //Move two position forward
        if (
          (pieces[(locationI + 1) * 8 + locationJ] === null &&
            pieces[(locationI + 2) * 8 + locationJ]) === null
        ) {
          isHighlightedTemp[(locationI + 2) * 8 + locationJ] = true;
        }
      } else {
        //Move one position forward
        if (
          locationI !== 7 &&
          pieces[(locationI + 1) * 8 + locationJ] === null
        ) {
          isHighlightedTemp[(locationI + 1) * 8 + locationJ] = true;
        }
      }
      // Or take on either side one step forward
      if (
        locationI !== 7 &&
        locationJ !== 0 &&
        pieces[(locationI + 1) * 8 + locationJ - 1] != null &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI !== 7 &&
        locationJ !== 7 &&
        pieces[(locationI + 1) * 8 + locationJ + 1] !== null &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ + 1] = true;
      }
    } else if (piece === KingWhite) {
      if (
        locationJ < 7 &&
        !selfPieces.includes(pieces[locationI * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[locationI * 8 + locationJ + 1] = true;
      }
      if (
        locationJ > 0 &&
        !selfPieces.includes(pieces[locationI * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[locationI * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 7 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ] = true;
      }
      if (
        locationI > 0 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ] = true;
      }
      if (
        locationI > 0 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI > 0 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ + 1] = true;
      }
    } else if (piece === QueenWhite) {
      for (t = locationI + 1, k = locationJ + 1; t <= 7 && k <= 7; t++, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ - 1; t >= 0 && k >= 0; t--, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ + 1; t >= 0 && k <= 7; t--, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1, k = locationJ - 1; t <= 7 && k >= 0; t++, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1; t <= 7; t++) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationI - 1; t >= 0; t--) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationJ + 1; t <= 7; t++) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
      for (t = locationJ - 1; t >= 0; t--) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
    } else if (piece === BishopWhite) {
      for (t = locationI + 1, k = locationJ + 1; t <= 7 && k <= 7; t++, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ - 1; t >= 0 && k >= 0; t--, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI - 1, k = locationJ + 1; t >= 0 && k <= 7; t--, k++) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
      for (t = locationI + 1, k = locationJ - 1; t <= 7 && k >= 0; t++, k--) {
        isHighlightedTemp[t * 8 + k] = true;
        if (selfPieces.includes(pieces[t * 8 + k])) {
          isHighlightedTemp[t * 8 + k] = false;
          break;
        }
        if (pieces[t * 8 + k] !== null) break;
      }
    } else if (piece === KnightWhite) {
      if (
        locationI > 1 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI - 2) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI - 2) * 8 + locationJ - 1] = true;
      }
      if (
        locationI > 1 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI - 2) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI - 2) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 6 &&
        locationJ > 0 &&
        !selfPieces.includes(pieces[(locationI + 2) * 8 + locationJ - 1])
      ) {
        isHighlightedTemp[(locationI + 2) * 8 + locationJ - 1] = true;
      }
      if (
        locationI < 6 &&
        locationJ < 7 &&
        !selfPieces.includes(pieces[(locationI + 2) * 8 + locationJ + 1])
      ) {
        isHighlightedTemp[(locationI + 2) * 8 + locationJ + 1] = true;
      }
      if (
        locationI < 7 &&
        locationJ < 6 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ + 2])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ + 2] = true;
      }
      if (
        locationI > 0 &&
        locationJ < 6 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ + 2])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ + 2] = true;
      }
      if (
        locationI < 7 &&
        locationJ > 1 &&
        !selfPieces.includes(pieces[(locationI + 1) * 8 + locationJ - 2])
      ) {
        isHighlightedTemp[(locationI + 1) * 8 + locationJ - 2] = true;
      }
      if (
        locationI > 0 &&
        locationJ > 1 &&
        !selfPieces.includes(pieces[(locationI - 1) * 8 + locationJ - 2])
      ) {
        isHighlightedTemp[(locationI - 1) * 8 + locationJ - 2] = true;
      }
    } else if (piece === RookWhite) {
      for (t = locationI + 1; t <= 7; t++) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationI - 1; t >= 0; t--) {
        isHighlightedTemp[t * 8 + locationJ] = true;
        if (selfPieces.includes(pieces[t * 8 + locationJ])) {
          isHighlightedTemp[t * 8 + locationJ] = false;
          break;
        }
        if (pieces[t * 8 + locationJ] !== null) break;
      }
      for (t = locationJ + 1; t <= 7; t++) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
      for (t = locationJ - 1; t >= 0; t--) {
        isHighlightedTemp[locationI * 8 + t] = true;
        if (selfPieces.includes(pieces[locationI * 8 + t])) {
          isHighlightedTemp[locationI * 8 + t] = false;
          break;
        }
        if (pieces[locationI * 8 + t] !== null) break;
      }
    }
    setIsHighlighted(isHighlightedTemp);
  };
  //Click Handler
  const squareClicked = (piece, id) => {
    var currentPositionI = parseInt(id.charAt(0));
    var currentPositionJ = parseInt(id.charAt(2));
    if (waitForNextMove) return;
    if (piece === null && selectedSquare === null) {
      setSelectedSquare(null);
      highlightSquares(piece, id);
    } else if (piece === null && selectedSquare !== null) {
      //move the previous selected piece to current position
      var selectedPieceI = selectedSquare[0];
      var selectedPieceJ = selectedSquare[1];
      if (
        isHighlighted[currentPositionI * 8 + currentPositionJ] &&
        (currentPositionI !== selectedPieceI ||
          currentPositionJ !== selectedPieceJ)
      ) {
        movePiece(
          currentPositionI,
          currentPositionJ,
          selectedPieceI,
          selectedPieceJ
        );
        sendMoveToServer(
          currentPositionI,
          currentPositionJ,
          selectedPieceI,
          selectedPieceJ
        );
      }
      setSelectedSquare(null);
      var isHighlightedTemp = [];
      for (var t = 0; t < 64; t++) isHighlightedTemp[t] = false;
      setIsHighlighted(isHighlightedTemp);
      //Wait for player two's move
    } else if (
      piece !== null &&
      selectedSquare === null &&
      selfPieces.includes(piece)
    ) {
      //Set Selected Square to this square as a piece is selected
      setSelectedSquare([currentPositionI, currentPositionJ]);
      // Highlight Movable squares
      highlightSquares(piece, id);
    } else if (piece !== null && selectedSquare !== null) {
      //Move piece if the position is movable else clear selection
      //and select the new piece
      var selectedPieceI = selectedSquare[0];
      var selectedPieceJ = selectedSquare[1];
      if (
        isHighlighted[currentPositionI * 8 + currentPositionJ] &&
        (currentPositionI !== selectedPieceI ||
          currentPositionJ !== selectedPieceJ)
      ) {
        //move piece
        movePiece(
          currentPositionI,
          currentPositionJ,
          selectedPieceI,
          selectedPieceJ
        );
        sendMoveToServer(
          currentPositionI,
          currentPositionJ,
          selectedPieceI,
          selectedPieceJ
        );
        setSelectedSquare(null);
        var isHighlightedTemp = [];
        for (var t = 0; t < 64; t++) isHighlightedTemp[t] = false;
        setIsHighlighted(isHighlightedTemp);
      } else if (selfPieces.includes(piece)) {
        //add this to selection
        setSelectedSquare([currentPositionI, currentPositionJ]);
        highlightSquares(piece, id);
      } else {
      }
    }
  };
  for (i = 7; i >= 0; i--) {
    for (j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0)
        squares.push(
          <DarkSquare
            highlight={isHighlighted[i * 8 + j]}
            id={i + "|" + j}
            key={i + "|" + j}
            piece={pieces[i * 8 + j]}
            onClick={squareClicked}
          />
        );
      else
        squares.push(
          <LightSquare
            highlight={isHighlighted[i * 8 + j]}
            id={i + "|" + j}
            key={i + "|" + j}
            piece={pieces[i * 8 + j]}
            onClick={squareClicked}
          />
        );
    }
  }
  //Down Here
  return (
    <div className="Game">
      <div></div>
      <div className="Board">{squares}</div>
      <div className="gameInfo">
        <div>
          {waitingForMove && (
            <div className="playerStatus">
              <span className="gameStatusText">Waiting For Opponents Move</span>
              <img src={WaitingAnimation} alt="Opponent's Turn" />
            </div>
          )}
          {!waitingForMove && (
            <div className="playerStatus">
              <span className="gameStatusText">Your Turn</span>
            </div>
          )}
        </div>
          <button className="resignButton" onClick={onGameLeave}>
            Resign
          </button>
      </div>
    </div>
  );
};

//Light Square for the chessboard
const LightSquare = ({ id, highlight, piece, onClick }) => {
  const onSquareClicked = () => {
    onClick(piece, id);
  };
  var classNames = "lightSquare";
  if (highlight) classNames = "lightSquareHighlighted";
  return (
    <div className={"square " + classNames} key={id} onClick={onSquareClicked}>
      {piece && <img alt="" src={piece}></img>}
    </div>
  );
};
//Dark Square for the chessboard
const DarkSquare = ({ id, highlight, piece, onClick }) => {
  const onSquareClicked = () => {
    onClick(piece, id);
  };
  var classNames = "darkSquare";
  if (highlight) classNames = "darkSquareHighlighted";
  return (
    <div className={"square " + classNames} key={id} onClick={onSquareClicked}>
      {piece && <img alt="" src={piece}></img>}
    </div>
  );
};
const MessageBox = () => {
  return (<div>

  </div>)
}
export default ChessBoard;