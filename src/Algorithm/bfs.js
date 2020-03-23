function bfs(startNode, endNode, grid, allowDiagnols) {
	let visitedNodes = [];
	let parentNodes = [];
	let [startx, starty] = [startNode.x, startNode.y];
	let [endx, endy] = [endNode.x, endNode.y];
	let { dirx, diry } = includeDiagnols(allowDiagnols);
	let q = [];

	grid[startx][starty].isVisited = true;
	q.push([startx, starty, 0]);
	while (q.length > 0) {
		let [curx, cury, cnt] = q.shift();

		for (let i = 0; i < dirx.length; i++) {
			let xx = curx + dirx[i];
			let yy = cury + diry[i];

			if (
				xx < 0 ||
				yy < 0 ||
				xx >= grid.length ||
				yy >= grid[0].length ||
				grid[xx][yy].isVisited === true ||
				grid[xx][yy].isWall === true
			)
				continue;
			grid[xx][yy].isVisited = true;
			grid[xx][yy].parent = [curx, cury];
			visitedNodes.push([xx, yy]);
			if (xx === endx && yy === endy) {
				console.log("Steps = ", cnt);
				console.log("From BFS");
				let x = xx;
				let y = yy;
				while (grid[x][y].parent != null) {
					parentNodes.push([x, y]);
					[x, y] = grid[x][y].parent;
				}
				parentNodes.push([startx, starty]);
				return [visitedNodes, parentNodes];
			}
			q.push([xx, yy, cnt + 1]);
		}
	}

	return [visitedNodes, parentNodes];
}

function includeDiagnols(allowDiagnols) {
	let dirx = [0, 1, 0, -1];
	let diry = [1, 0, -1, 0];
	if (allowDiagnols === false) return { dirx, diry };
	else {
		dirx = [0, 1, 1, 1, 0, -1, -1, -1];
		diry = [1, 1, 0, -1, -1, -1, 0, 1];
		return { dirx, diry };
	}
}

export default bfs;
