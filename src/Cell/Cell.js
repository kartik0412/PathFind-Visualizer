import React from "react";
import "./Cell.css";

class Cell extends React.Component {
	onDragOver = e => {
		e.preventDefault();
	};

	onDrop = ev => {
		ev.preventDefault();
		let data = ev.dataTransfer.getData("text");
		let a = ev.target.id.split("-");
		let b = data.split("-");
		this.props.handleStartEnd(a[1], a[2], b[1], b[2]);
	};
	onDragStart = e => {
		console.log(e.target.id);
		e.dataTransfer.setData("text", e.target.id);
	};

	render() {
		const { x, y, isStart, isWall, isEnd, onMouseDown, onMouseUp, onMouseEnter } = this.props;
		let cell = "notWall";
		if (isStart) cell = "startCell";
		else if (isEnd) cell = "endCell";
		else if (isWall) cell = "wall";

		return (
			<td
				draggable
				id={`node-${x}-${y}`}
				onDragOver={e => {
					this.onDragOver(e);
				}}
				onDragStart={e => {
					this.onDragStart(e);
				}}
				onDrop={e => this.onDrop(e)}
				className={cell}
				onMouseDown={() => onMouseDown(x, y)}
				onMouseUp={() => onMouseUp()}
				onMouseEnter={() => onMouseEnter(x, y)}
			></td>
		);
	}
}

export default Cell;
