import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {
	renderSquare(i) {
		return (
			<Square
				key={i}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		const board = [];
		for (let x = 0; x < 3; x++) {
			const row = [];
			for (let y = 0; y < 3; y++) {
				row.push(this.renderSquare(x * 3 + y));
			}
			board.push(<div key={x} className="board-row">{row}</div>);
		}

		return (
			<div>{board}</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
			}],
			stepNumber: 0,
			xIsNext: true,
			movesOrderAsc: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		// Return if there's a winner or
		// a filled square was clicked
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
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

	toggleMovesOrder() {
		// const history = this.state.history.slice(0, this.state.stepNumber + 1);
		// const current = history[history.length - 1];
		// const squares = current.squares.slice().sort();
		// console.log(history);

		this.setState({
			movesOrderAsc: !this.state.movesOrderAsc,
		});
	}

	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		const stepNumber = this.state.stepNumber;

		const moves = history.map((step, move) => {
			const desc = move ? 'Go to move #' + move : 'Go to game start';
			return (
				<li
					className='move-list-item'
					key={move}>
					<button
						className={move === stepNumber ? 'move-list-item-selected' : 'move-list-item'}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			);
		});

		if (!this.state.movesOrderAsc)
			moves.sort((a, b) => a.key < b.key ? 1 : -1);

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else {
			status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
		}

		return (
			<div className="game">
				<div className="game-info">
					<h1>😺 G A T O 😺</h1>
					<h2>{status}</h2>
				</div>
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<ol>{moves}</ol>
				</div>
				<div>
					<button
						className="move-list-item-selected"
						onClick={() => this.toggleMovesOrder()}
					>
						Toggle Moves Order
					</button>
				</div>
			</div>
		)
	}
}

ReactDOM.render(<Game />, document.getElementById('root'));

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}