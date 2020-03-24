import React from "react";
import Cell from "../Cell/Cell";
import "./Board.css";
import algorithm from "../Algorithm/algorithm.js";

let nrows = 19;
let ncols = 55;

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
			pace: 10,
			startCoord: [7, 8],
			endCoord: [7, 46],
			isMove: false,
			previous: []
		};
		this.handleButton = this.handleButton.bind(this);
		this.handleRemovePath = this.handleRemovePath.bind(this);
		this.handleAllowDiagnols = this.handleAllowDiagnols.bind(this);
		this.handleAlgo = this.handleAlgo.bind(this);
		this.handleRandomValue = this.handleRandomValue.bind(this);
		this.handlePaceValue = this.handlePaceValue.bind(this);
		this.handleMaze = this.handleMaze.bind(this);
		this.handleClearWalls = this.handleClearWalls.bind(this);
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

	handleClearWalls() {
		let newgrid = this.state.grid;
		for (let i = 0; i < nrows; i++) {
			for (let j = 0; j < ncols; j++) {
				newgrid[i][j].isWall = false;
			}
		}
		this.setState(
			{
				grid: newgrid,
				isMouseDown: false,
				ison: false,
				hasdone: false,
				freeze: false,
				randomValue: 0
			},
			() => {
				for (let i = 0; i < nrows; i++) {
					for (let j = 0; j < ncols; j++) {
						let cellType = "notWall";
						if (this.state.grid[i][j].isEnd) cellType = "endCell";
						else if (this.state.grid[i][j].isStart) cellType = "startCell";
						console.log(i, j, document.getElementById(`node-${i}-${j}`).className);
						document.getElementById(`node-${i}-${j}`).className = cellType;
						document.getElementById(`node-${i}-${j}`).innerHTML = "";
					}
				}
			}
		);
	}

	handleRandomValue(evt) {
		this.setState(
			{
				randomValue: Number(evt.target.value)
			},
			() => {
				let newGrid = [];
				for (let i = 0; i < nrows; i++) {
					let x = [];
					for (let j = 0; j < ncols; j++) {
						let makeWall = Math.random() <= this.state.randomValue;
						if (this.state.grid[i][j].isStart || this.state.grid[i][j].isEnd) makeWall = false;

						x.push({
							x: i,
							y: j,
							isWall: makeWall,
							isStart: this.state.grid[i][j].isStart,
							isEnd: this.state.grid[i][j].isEnd,
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
						freeze: false,
						randomValue: 0,
						isMove: false,
						previous: []
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
		);
	}

	handleMouseDown(x, y) {
		if (this.state.ison || this.state.hasdone) return;
		if (this.state.grid[x][y].isStart || this.state.grid[x][y].isEnd) {
			this.setState({
				isMove: true,
				previous: [x, y]
			});
		} else {
			const newGrid = toggleWall(this.state.grid, x, y);
			this.setState({ grid: newGrid, isMouseDown: true });
		}
	}
	handleMouseUp() {
		if (this.state.ison) return;
		this.setState({ isMouseDown: false, isMove: false });
	}
	handleMouseEnter(x, y) {
		if (this.state.ison || this.state.hasdone) return;
		if (this.state.isMove) {
			if (this.state.grid[x][y].isWall) return;
			let grid = this.state.grid;
			let [prex, prey] = this.state.previous;
			if (prex === x && prey === y) return;
			let xcoord = this.state.startCoord;
			let ycoord = this.state.endCoord;
			if (grid[prex][prey].isStart) {
				grid[prex][prey].isStart = false;
				grid[x][y].isStart = true;
				xcoord = [x, y];
			} else {
				grid[prex][prey].isEnd = false;
				grid[x][y].isEnd = true;
				ycoord = [x, y];
			}
			this.setState({
				grid: grid,
				startCoord: xcoord,
				endCoord: ycoord,
				previous: [x, y]
			});
		}
		if (!this.state.isMouseDown) return;
		const newGrid = toggleWall(this.state.grid, x, y);
		this.setState({ grid: newGrid, isMouseDown: true });
	}

	handleAllowDiagnols(evt) {
		this.setState({
			allowDiagnols: !this.state.allowDiagnols
		});
	}

	handleMaze() {
		let maze = [];
		for (let i = 0; i < ncols; i++) {
			if (this.state.grid[0][i].isStart || this.state.grid[0][i].isEnd) continue;
			maze.push([0, i]);
		}
		for (let i = 1; i < nrows; i++) {
			if (this.state.grid[i][ncols - 1].isStart || this.state.grid[i][ncols - 1].isEnd) continue;
			maze.push([i, ncols - 1]);
		}
		for (let i = ncols - 2; i >= 0; i--) {
			if (this.state.grid[nrows - 1][i].isStart || this.state.grid[nrows - 1][i].isEnd) continue;
			maze.push([nrows - 1, i]);
		}
		for (let i = nrows - 2; i >= 1; i--) {
			if (this.state.grid[i][0].isStart || this.state.grid[i][0].isEnd) continue;
			maze.push([i, 0]);
		}

		for (let i = 3; i < nrows - 1; i += 2) {
			for (let j = 1; j < ncols - 1; j++) {
				if (this.state.grid[i][j].isStart || this.state.grid[i][j].isEnd) continue;
				if (Math.random() <= 0.35) {
					maze.push([i, j]);
				}
			}
		}

		for (let j = 3; j < ncols; j += 2) {
			for (let i = 1; i < nrows - 1; i++) {
				if (this.state.grid[i][j].isStart || this.state.grid[i][j].isEnd) continue;
				if (Math.random() <= 0.35) {
					maze.push([i, j]);
				}
			}
		}

		let grid = this.state.grid;
		for (let i = 0; i < maze.length; i++) {
			let [x, y] = maze[i];
			grid[x][y].isWall = true;
			grid[x][y].isVisited = false;
			grid[x][y].distance = Infinity;
			grid[x][y].parent = null;
		}
		for (let i = 0; i <= maze.length; i++) {
			if (i === maze.length) {
				setTimeout(() => {
					this.setState({
						grid: grid,
						isMouseDown: false,
						ison: false,
						hasdone: false,
						freeze: false,
						randomValue: 0,
						isMove: false,
						previous: []
					});
				}, 20 * i);
			} else {
				setTimeout(() => {
					document.getElementById(`node-${maze[i][0]}-${maze[i][1]}`).className = "wall";
				}, 20 * i);
			}
		}
	}

	handleReset() {
		this.setState(
			{
				grid: this.createNewGrid(),
				isMouseDown: false,
				ison: false,
				hasdone: false,
				freeze: false,
				randomValue: 0,
				startCoord: [7, 8],
				endCoord: [7, 46]
			},
			() => {
				for (let i = 0; i < nrows; i++) {
					for (let j = 0; j < ncols; j++) {
						let cellType = "notWall";
						if (this.state.grid[i][j].isEnd) cellType = "endCell";
						else if (this.state.grid[i][j].isStart) cellType = "startCell";
						console.log(i, j, document.getElementById(`node-${i}-${j}`).className);
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
					isStart: this.state.grid[i][j].isStart,
					isEnd: this.state.grid[i][j].isEnd,
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
						else if (this.state.grid[i][j].isStart) cellType = "startCell";
						else if (this.state.grid[i][j].isEnd) cellType = "endCell";
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
				let [startx, starty] = this.state.startCoord;
				let [endx, endy] = this.state.endCoord;
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
		for (let i = parentNodes.length - 2; i >= 1; i--) {
			if (i === 1) {
				setTimeout(() => {
					this.setState({ ison: false, hasdone: true, freeze: false });
				}, 20 * (parentNodes.length - i));
				setTimeout(() => {
					document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).className = "tracePath";
					document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).innerHTML =
						parentNodes.length - i;
					document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).style.fontSize = "10px";
				}, 20 * (parentNodes.length - i + 1));

				return;
			}
			setTimeout(() => {
				document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).className = "tracePath";
				document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).innerHTML =
					parentNodes.length - i - 1;
				document.getElementById(`node-${parentNodes[i][0]}-${parentNodes[i][1]}`).style.fontSize = "10px";
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
					isStart: i === 7 && j === 8,
					isEnd: i === 7 && j === 46,
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
				<tr key={i} className='row'>
					{x}
				</tr>
			);
		}
		let buttonvalue = "Start";
		if (this.state.ison) buttonvalue = "running..";
		else if (this.state.hasdone) buttonvalue = "reset";
		return (
			<div className='mainBox'>
				<div className='box'>
					<h2 className='heading'>
						PathFind <span style={{ color: "#fc766a" }}>Visualizer</span>
					</h2>
					<div className='selectdiv'>
						<label>
							<select disabled={this.state.freeze} onChange={this.handleAlgo} name='algo'>
								<option defaultValue value='1'>
									A Star
								</option>
								<option value='2'>Dijkstra</option>
								<option value='3'>Greedy BFS</option>
								<option value='4'>BFS</option>
								<option value='5'>DFS</option>
							</select>
						</label>
					</div>
					<div className='selectdiv'>
						<label>
							<select disabled={this.state.freeze} onChange={this.handleRandomValue} name='randomValue'>
								<option defaultValue value='0'>
									Random Walls 0%
								</option>
								<option value='0.2'>Random Walls 20%</option>
								<option value='0.3'>Random Walls 30%</option>
								<option value='0.4'>Random Walls 40%</option>
							</select>
						</label>
					</div>
					<div className='selectdiv1'>
						<label>
							<select disabled={this.state.ison} onChange={this.handlePaceValue} name='pace'>
								<option defaultValue value='8'>
									Fast
								</option>
								<option value='20'>Average</option>
								<option value='30'>Slow</option>
							</select>
						</label>
					</div>
					<button
						disabled={this.state.ison}
						style={{ marginTop: "60px" }}
						onClick={this.handleButton}
						className='mainButton'
					>
						{buttonvalue}
					</button>

					<button onClick={this.handleMaze} className='mainButton'>
						Maze
					</button>
					<button onClick={this.handleClearWalls} className='mainButton2'>
						Clear All
					</button>

					<button onClick={this.handleRemovePath} className='mainButton2'>
						Clear Path
					</button>

					{this.state.algo !== 5 ? (
						<label>
							<input
								type='checkbox'
								defaultChecked={this.state.allowDiagnols}
								onChange={this.handleAllowDiagnols}
							/>
							<span style={{ color: "white", font: "16px Fira Sans, sans-serif" }}>Allow Diagonals</span>
						</label>
					) : (
						""
					)}
				</div>

				<table className='outer'>
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
