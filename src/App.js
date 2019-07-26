import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      player1: 1,
      player2: 2,
      currentPlayer: null,
      board: [],
      gameOver: false,
      message: ''
    };

    // Bind play function to App component
    this.play = this.play.bind(this);
    //console.log("1"); //3: only on start
  }

  // Starts new game
  initBoard() {
    // Create a blank 6x7 matrix
    //console.log("2"); //5: only on start
    let board = [];
    for (let r = 0; r < 6; r++) {
      let row = [];
      for (let c = 0; c < 7; c++) {
        row.push(null)
      }
      board.push(row);
      //console.log("3");//6: runs 6 times 1 for each row
    }
    //console.log("4"); //7: only on start
    this.setState({
      board,
      currentPlayer: this.state.player1,
      gameOver: false,
      message: ''
    });
  }

  togglePlayer() {
    //console.log("5");
    return (this.state.currentPlayer === this.state.player1) ? this.state.player2 : this.state.player1;
  }

  play(c) {

    console.log("6"); //1: each move. c is colloumn placed 0-6
    if (!this.state.gameOver) {
      // Place piece on board
      //console.log("7");
      let board = this.state.board;

      for (let r = 5; r >= 0; r--) {
        //console.log(board);
        //board is an array of 6 arrays each array has 7 elements
        // 5 is bottom 0 is top
        //for red piece the array is 1 yellow its 2
        //in the correct location
        //ex: bottom middle for red is
        //board[5] = array[null,null,null,1,null,null,null]
        if (!board[r][c]) {
          board[r][c] = this.state.player1;
          //console.log("8");
          break;
        }
        //console.log("9"); //row # for placement
        //if its second row this runs once
        //3rd row this runs twice etc etc
      }

      // Check status of board
      let result = this.checkAll(board);
      if (result === this.state.player1) {
        //console.log("10"); //for red wins
        this.setState({board, gameOver: true, message: 'Player 1 (red) wins!'});
      } else if (result === this.state.player2) {
        //console.log("11"); //for yellow wins
        this.setState({board, gameOver: true, message: 'Player 2 (yellow) wins!'});
      } else if (result === 'draw') {
        //console.log("12"); //for draw game
        this.setState({board, gameOver: true, message: 'Draw game.'});
      } else {
        //console.log("13"); //toggles to next player
        this.setState({board, currentPlayer: this.togglePlayer()});
        this.ai(board);
      }
    } else {
      //console.log("14"); //only if click after game is over
      this.setState({message: 'Game over. Please start a new game.'});
    }
    //console.log("end play");
  }
  aiEasy(board){
    let count = 0;
    let aiRow = Math.floor(Math.random() * 6);
    for (var r = 0; r < 6; r++) {
      if (board[r][aiRow]) {
        count++;
      }
    }
    if (count !== 6) {
      board[5 - count][aiRow] = this.state.player2;
      return board;
    } else this.aiEasy(board);


  }
  aiMedium(board){
      let count = 0;
      for(let r = 5; r > 0; r--){
        for(let c = 0; c < 7; c++){
            if (board[r][c] !== null && board[r][c + 1] !== null && board[r][c + 2] !== null) {
              if (board[r][c] === 1 && board[r][c + 1] === 1 && board[r][c + 2] === 1) {
                //horizontal
                console.log("caught horizontal");
                if (board[r][c + 3] !== null) {
                  board[r][c + 3] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                }else if (board[r][c-1] !== null){
                  board[r][c - 1] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                }
              }
            } else if (board[r][c] !== null && board[r - 1][c] !== null && board[r - 2][c] !== null) {
              if (board[r][c] === 1 && board[r - 1][c] === 1 && board[r - 2][c] === 1) {
                //vertical
                console.log("caught vertical");
                if (board[r - 3][c] !== null) {
                  board[r - 3][c] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                }
              }
            } else if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] !== null) {
              if (1 === board[r][c] && 1 === board[r - 1][c + 1] &&
                  1 === board[r - 2][c + 2]) {
                //diagonal right
                console.log("caught d right");
                if (board[r - 3][c + 3] !== null) {
                  board[r - 3][c + 3] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                } else if (board[r + 1][c - 1] !== null) {
                  board[r + 1][c - 1] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                }
              }
            } else if (board[r][c] !== null && board[r - 1][c + 1] !== null && board[r - 2][c + 2] !== null) {
              if (1 === board[r][c] && 1 === board[r - 1][c + 1] &&
                  1 === board[r - 2][c + 2]) {
                //diagonal left
                console.log("caught d left");
                if (board[r - 3][c - 3] !== null) {
                  board[r - 3][c - 3] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                } else if (board[r + 1][c + 1] !== null) {
                  board[r + 1][c + 1] = this.state.player2;
                  r = 100;
                  c = 100;
                  break;
                }
              }
          }
        }
        count++;
        }
      console.log(count);
    console.log(board);
      if(count !== 5) {
        return board;
      }else {
        board = this.aiEasy(board);
        return board;
      }
  }
  aiHard(board){


  }

  ai(board) {
    //console.log("ai");
    //console.log(board);
    //place random start
    board = this.aiMedium(board);
    //place random end


    //check win below
    if (!this.state.gameOver) {
        let result = this.checkAll(board);
        if (result === this.state.player1) {
          //console.log("10"); //for red wins
          this.setState({board, gameOver: true, message: 'Player 1 (red) wins!'});
        } else if (result === this.state.player2) {
          //console.log("11"); //for yellow wins
          this.setState({board, gameOver: true, message: 'Player 2 (yellow) wins!'});
        } else if (result === 'draw') {
          //console.log("12"); //for draw game
          this.setState({board, gameOver: true, message: 'Draw game.'});
        } else {
          //console.log("13"); //toggles to next player

          this.setState({board, currentPlayer: this.togglePlayer()});
        }
      }
    else
      {
        //console.log("14"); //only if click after game is over
        this.setState({message: 'Game over. Please start a new game.'});
      }
    }

  checkVertical(board) {
    // Check only if row is 3 or greater
    //console.log("15");
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c] &&
              board[r][c] === board[r - 2][c] &&
              board[r][c] === board[r - 3][c]) {
            //console.log("16");
            return board[r][c];
          }
        }
      }
    }
  }

  checkHorizontal(board) {
    // Check only if column is 3 or less
    //console.log("17");
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r][c + 1] &&
              board[r][c] === board[r][c + 2] &&
              board[r][c] === board[r][c + 3]) {
            //console.log("18");
            return board[r][c];
          }
        }
      }
    }
  }

  checkDiagonalRight(board) {
    // Check only if row is 3 or greater AND column is 3 or less
    //console.log("19");
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c + 1] &&
              board[r][c] === board[r - 2][c + 2] &&
              board[r][c] === board[r - 3][c + 3]) {
            //console.log("20");
            return board[r][c];
          }
        }
      }
    }
  }

  checkDiagonalLeft(board) {
    // Check only if row is 3 or greater AND column is 3 or greater
    //console.log("21");
    for (let r = 3; r < 6; r++) {
      for (let c = 3; c < 7; c++) {
        if (board[r][c]) {
          if (board[r][c] === board[r - 1][c - 1] &&
              board[r][c] === board[r - 2][c - 2] &&
              board[r][c] === board[r - 3][c - 3]) {
            //console.log("22");
            return board[r][c];
          }
        }
      }
    }
  }

  checkDraw(board) {
    //console.log("22");
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 7; c++) {
        if (board[r][c] === null) {
          //console.log("23")
          return null;
        }
      }
    }
    //console.log("24");
    return 'draw';
  }

  checkAll(board) {
    //console.log("25"); //runs after every move
    //checks for wins below and passes in the game board
    return this.checkVertical(board) || this.checkDiagonalRight(board) || this.checkDiagonalLeft(board) || this.checkHorizontal(board) || this.checkDraw(board);
  }

  componentWillMount() {
    //console.log("26"); //4: only on start
    this.initBoard();
  }

  render() {
    return (
        <div>
          <div className="button" onClick={() => {this.initBoard()}}>New Game</div>

          <table>
            <thead>
            </thead>
            <tbody>
            {this.state.board.map((row, i) => (<Row key={i} row={row} play={this.play} />))}
            </tbody>
          </table>

          <p className="message">{this.state.message}</p>
        </div>
    );
  }
}
//console.log("27"); //1: only on start
// Row component
const Row = ({ row, play }) => {
  return (
      <tr>
        {row.map((cell, i) => <Cell key={i} value={cell} columnIndex={i} play={play} />)}
      </tr>
  );
};
//console.log("28"); //2: only on start
const Cell = ({ value, columnIndex, play }) => {
  let color = 'white';
  if (value === 1) {
    color = 'red';
  } else if (value === 2) {
    color = 'yellow';
  }
//console.log("29"); //end of each move runs 42 times
  return (
      <td>
        <div className="cell" onClick={() => {play(columnIndex)}}>
          <div className={color}></div>
        </div>
      </td>
  );
};

export default App;
