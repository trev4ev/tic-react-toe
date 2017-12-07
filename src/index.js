import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className={"square " + props.className} onClick = {props.onClick}> 
        {props.value}
      </button>
    );
}

function ToggleOrderButton(props) {
    return (
        <button className = "toggleButton" onClick = {props.onClick}>
            {props.toggleMessage}
        </button>
        );
}

class Board extends React.Component {
    checkHighlight(i) {
        if (this.props.win) {
            for(let k = 1; k < 4; k++) {
                if (this.props.win[k] === i)
                    return true;
            }
            return false;
        }
    }

  renderSquare(i) {
      let className = "notHighlighted";
      if(this.checkHighlight(i)) {
          className = "highlighted";
        }
        
    return <Square className = {className} value={this.props.squares[i]} onClick = {() => this.props.onClick(i)} />;
  }

  render() {
      var board = [];
      for(var i = 0; i < 3; i++) {
          var row = [];
          for( var j = 0; j < 3; j++) {
              row.push(this.renderSquare(i*3+j));
          }
          board.push(React.createElement("div", {className: "board-row"}, row));
      }
    return React.createElement("div", null, board);
  }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascendingOrder: true,
        };
    }

    toggleOrder() {
        this.setState({
            ascendingOrder: !this.state.ascendingOrder,
        });
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice()
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                space: i,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

  render() {
      let history = this.state.history;
      const stepNumber = this.state.stepNumber;
      const current = history[stepNumber]
      const winner = calculateWinner(current.squares);
      if (!this.state.ascendingOrder) {
          history = history.slice(0).reverse();
      }
      const moves = history.map((step, move) => {
          if(!this.state.ascendingOrder) {
              move = history.length - move - 1;
          }
          const desc = move ? 
            'Go to move #' + move + calculateSquare(step.space):
            'Go to game start';
        if (move === stepNumber) {
            return (
                <li key = {move}>
                    <button className = 'currentMove' onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        }
        return (
            <li key = {move}>
                <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
      });

      const toggleMessage = this.state.ascendingOrder ? "Order by descending" : "Order by ascending";
      
      let status;
      if (winner) {
          status = 'Winner: ' + winner[0];
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
          <Board win = {winner} squares= {current.squares} onClick = {(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ToggleOrderButton toggleMessage = {toggleMessage} onClick = {() => this.toggleOrder()}/>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return [squares[a], a, b, c];
        }
    }
    return null;
}


function calculateSquare(i) {
    let y = Math.floor(i/3) + 1;
    let x = i % 3 + 1;
    return ' at (' + x + ',' + y + ')';
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
