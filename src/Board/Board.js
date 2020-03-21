import React from "react";
import Cell from "../Cell/Cell";
import "./Board.css";
import algorithm from "../Algorithm/algorithm.js";

let nrows = 18;
let ncols = 55;

let startx = 4;
let starty = 8;
let endx = 12;
let endy = 44;

class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			grid: this.createNewGrid(),
			isMouseDown: false,
			ison: false,
			hasdone: false,
			allowDiagnols: false,
			algo: 1,
			freeze: false,
			randomValue: 0,
			pace: 10
		};
		this.handleButton = this.handleButton.bind(this);
		this.handleRemovePath = this.handleRemovePath.bind(this);
		this.handleRandomWalls = this.handleRandomWalls.bind(this);
		this.handleAllowDiagnols = this.handleAllowDiagnols.bind(this);
		this.handleAlgo = this.handleAlgo.bind(this);
		this.handleRandomValue = this.handleRandomValue.bind(this);
		this.handlePaceValue = this.handlePaceValue.bind(this);
	}

	handleAlgo(evt) {
		this.setState({
			algo: Number(evt.target.value)
		});
	}
	handlePaceValue(evt) {
		this.setState({
			pace: Number(evt.target.value)
		});
	}
	handleRandomValue(evt) {
		this.setState({
			randomValue: Number(evt.target.value)
		});
	}

	handleMouseDown(x, y) {
		if (this.state.ison || this.state.hasdone) return;
		const newGrid = toggleWall(this.state.grid, x, y);
		this.setState({ grid: newGrid, isMouseDown: true });
	}
	handleMouseUp() {
		if (this.state.ison) return;
		this.setState({ isMouseDown: false });
	}
	handleMouseEnter(x, y) {
		if (this.state.ison || this.state.hasdone) return;
		if (!this.state.isMouseDown) return;
		const newGrid = toggleWall(this.state.grid, x, y);
		this.setState({ grid: newGrid, isMouseDown: true });
	}

	handleAllowDiagnols(evt) {
		this.setState({
			allowDiagnols: !this.state.allowDiagnols
		});
	}

	handleReset() {
		this.setState(
			{
				grid: this.createNewGrid(),
				isMouseDown: false,
				ison: false,
				hasdone: false,
				freeze: false,
				randomValue: this.state.randomValue
			},
			() => {
				for (let i = 0; i < nrows; i++) {
					for (let j = 0; j < ncols; j++) {
						let cellType = "notWall";
						if (this.state.grid[i][j].isEnd) cellType = "endCell";
						if (this.state.grid[i][j].isStart) cellType = "startCell";
						document.getElementById(`node-${i}-${j}`).className = cellType;
						document.getElementById(`node-${i}-${j}`).innerHTML = "";
					}
				}
			}
		);
	}

	handleRandomWalls() {
		let newGrid = [];
		for (let i = 0; i < nrows; i++) {
			let x = [];
			for (let j = 0; j < ncols; j++) {
				let makeWall = Math.random() <= this.state.randomValue;
				if ((i === startx && j === starty) || (i === endx && j === endy)) makeWall = false;
				x.push({
					x: i,
					y: j,
					isWall: makeWall,
					isStart: i === startx && j === starty,
					isEnd: i === endx && j === endy,
					isVisited: false,
					distance: Infinity,
					parent: null
				});
			}
			newGrid.push(x);
		}
		this.setState(
			{
				grid: newGrid,
				isMouseDown: false,
				ison: false,
				hasdone: false,
				freeze: false
			},
			() => {
				for (let i = 0; i < nrows; i++) {
					for (let j = 0; j < ncols; j++) {
						let cellType = "notWall";
						if (this.state.grid[i][j].isEnd) cellType = "endCell";
						else if (this.state.grid[i][j].isStart) cellType = "startCell";
						else if (this.state.grid[i][j].isWall) cellType = "wall";
						document.getElementById(`node-${i}-${j}`).className = cellType;
						document.getElementById(`node-${i}-${j}`).innerHTML = "";
					}
				}
			}
		);
	}

	handleRemovePath() {
		let newGrid = [];
		for (let i = 0; i < nrows; i++) {
			let x = [];
			for (let j = 0; j < ncols; j++) {
				x.push({
					x: i,
					y: j,
					isWall: this.state.grid[i][j].isWall,
					isStart: i === startx && j === starty,
					isEnd: i === endx && j === endy,
					isVisited: false,
					distance: Infinity,
					parent: null
				});
			}
			newGrid.push(x);
		}
		this.setState(
			{
				grid: newGrid,
				isMouseDown: false,
				ison: false,
				hasdone: false
			},
			() => {
				for (let i = 0; i < nrows; i++) {
					for (let j = 0; j < ncols; j++) {
						let cellType = "notWall";
						if (this.state.grid[i][j].isWall) cellType = "wall";
						else if (this.state.grid[i][j].isEnd) cellType = "endCell";
						else if (this.state.grid[i][j].isStart) cellType = "startCell";
						document.getElementById(`node-${i}-${j}`).className = cellType;
						document.getElementById(`node-${i}-${j}`).innerHTML = "";
					}
				}
			}
		);
	}

	handleButton() {
		if (this.state.hasdone) {
			this.handleReset();
			return;
		}

		this.setState(
			{
				ison: true,
				freeze: true
			},
			() => {
				let [visitedNodes, parentNodes] = algorithm(
					this.state.grid[startx][starty],
					this.state.grid[endx][endy],
					this.state.grid,
					this.state.algo,
					this.state.allowDiagnols
				);
				console.log(parentNodes.length);
				this.animateEffect(visitedNodes, parentNodes);
			}
		);
	}

	animatePath(parentNodes) {
		for (let i = parentNodes.length; i >= 0; i--) {
			if (i === 0) {
				setTimeout(() => {
					this.setState({ ison: false, hasdone: true, freeze: false });
				}, 20 * (parentNodes.length - i));

				return;
			}
			setTimeout(() => {
				document.getElementById(`node-${parentNodes[i - 1][0]}-${parentNodes[i - 1][1]}`).className = "tracePath";
				document.getElementById(`node-${parentNodes[i - 1][0]}-${parentNodes[i - 1][1]}`).innerHTML =
					parentNodes.length - i;
			}, 20 * (parentNodes.length - i));
		}
	}

	animateEffect(visitedNodes, parentNodes) {
		for (let i = 0; i <= visitedNodes.length; i++) {
			if (i === visitedNodes.length) {
				if (parentNodes.length === 0) {
					setTimeout(() => {
						this.setState({ ison: false, hasdone: true, freeze: false });
						return;
					}, this.state.pace * i);
				} else {
					setTimeout(() => {
						this.animatePath(parentNodes);
					}, this.state.pace * i);
				}
			} else {
				setTimeout(() => {
					document.getElementById(`node-${visitedNodes[i][0]}-${visitedNodes[i][1]}`).className = "visited";
				}, this.state.pace * i);
			}
		}
	}

	createNewGrid() {
		let newGrid = [];
		for (let i = 0; i < nrows; i++) {
			let x = [];
			for (let j = 0; j < ncols; j++) {
				x.push({
					x: i,
					y: j,
					isWall: false,
					isStart: i === startx && j === starty,
					isEnd: i === endx && j === endy,
					isVisited: false,
					distance: Infinity,
					parent: null
				});
			}
			newGrid.push(x);
		}
		return newGrid;
	}

	render() {
		let grid = this.state.grid;
		let board = [];
		for (let i = 0; i < nrows; i++) {
			let x = [];
			for (let j = 0; j < ncols; j++) {
				x.push(
					<Cell
						key={`${i}-${j}`}
						x={i}
						y={j}
						isStart={grid[i][j].isStart}
						isWall={grid[i][j].isWall}
						isEnd={grid[i][j].isEnd}
						onMouseDown={(i, j) => this.handleMouseDown(i, j)}
						onMouseUp={() => this.handleMouseUp()}
						onMouseEnter={(i, j) => this.handleMouseEnter(i, j)}
					/>
				);
			}
			board.push(
				<tr key={i} className="row">
					{x}
				</tr>
			);
		}
		let buttonvalue = "Start";
		if (this.state.ison) buttonvalue = "running..";
		else if (this.state.hasdone) buttonvalue = "reset";
		return (
			<div>
				<div className="box">
					<h2 className="heading">
						PathFind <span style={{ color: "#fc766a" }}>Visualizer</span>
					</h2>
					<div className="selectdiv">
						<label>
							<select disabled={this.state.freeze} onChange={this.handleAlgo} name="algo">
								<option defaultValue value="1">
									BFS
								</option>
								<option className="choice" value="2">
									Dijkstra
								</option>
								<option className="choice" value="3">
									A Star
								</option>
								<option className="choice" value="4">
									Greedy BFS
								</option>
								<option className="choice" value="5">
									DFS
								</option>
							</select>
						</label>
					</div>
					<div className="selectdiv">
						<label>
							<select disabled={this.state.freeze} onChange={this.handleRandomValue} name="randomValue">
								<option defaultValue value="0">
									Randomness 0%
								</option>
								<option className="choice" value="0.2">
									Randomness 20%
								</option>
								<option className="choice" value="0.3">
									Randomness 30%
								</option>
								<option className="choice" value="0.4">
									Randomness 40%
								</option>
							</select>
						</label>
					</div>

					<button
						disabled={this.state.ison}
						style={{ marginTop: "60px" }}
						onClick={this.handleButton}
						className="mainButton"
					>
						{buttonvalue}
					</button>

					<button onClick={this.handleRandomWalls} className="mainButton">
						Random
					</button>

					<button onClick={this.handleRemovePath} className="mainButton2">
						Clear
					</button>

					<div className="selectdiv1">
						<label>
							<select disabled={this.state.ison} onChange={this.handlePaceValue} name="pace">
								<option defaultValue value="10">
									Fast
								</option>
								<option value="20">Average</option>
								<option value="30">Slow</option>
							</select>
						</label>
					</div>
					{this.state.algo !== 5 ? (
						<label>
							<input
								type="checkbox"
								defaultChecked={this.state.allowDiagnols}
								onChange={this.handleAllowDiagnols}
							/>
							<span style={{ color: "white", font: "16px Consolas" }}>Allow Diagonals</span>
						</label>
					) : (
						""
					)}
				</div>

				<table className="outer">
					<tbody>{board}</tbody>
				</table>
			</div>
		);
	}
}

const toggleWall = (grid, x, y) => {
	const newGrid = grid.slice();
	const node = newGrid[x][y];
	const newNode = {
		...node,
		isWall: !node.isWall
	};
	newGrid[x][y] = newNode;
	return newGrid;
};

export default Board;
