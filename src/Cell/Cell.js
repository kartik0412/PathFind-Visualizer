import React from "react";
import "./Cell.css";

class Cell extends React.Component {
	render() {
		const { x, y, isStart, isWall, isEnd, onMouseDown, onMouseUp, onMouseEnter } = this.props;
		let cell = "notWall";
		if (isStart) cell = "startCell";
		else if (isEnd) cell = "endCell";
		else if (isWall) cell = "wall";

		return (
			<td
				id={`node-${x}-${y}`}
				className={cell}
				onMouseDown={() => onMouseDown(x, y)}
				onMouseUp={() => onMouseUp()}
				onMouseEnter={() => onMouseEnter(x, y)}
			></td>
		);
	}
}

export default Cell;
