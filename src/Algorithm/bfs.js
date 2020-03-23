function bfs(startNode, endNode, grid, allowDiagnols) {
	let visitedNodes = [];
	let parentNodes = [];
	let [startx, starty] = [startNode.x, startNode.y];
	let [endx, endy] = [endNode.x, endNode.y];
	let q = [];

	let { dirx, diry } = includeDiagnols(allowDiagnols);

	startNode.isVisited = true;
	startNode.distance = 0;
	q.push(startNode);

	while (q.length > 0) {
		let curNode = q.shift();

		for (let i = 0; i < dirx.length; i++) {
			let xx = curNode.x + dirx[i];
			let yy = curNode.y + diry[i];

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
			visitedNodes.push([xx, yy]);
			grid[xx][yy].parent = [curNode.x, curNode.y];

			visitedNodes.push([xx, yy]);
			if (xx === endx && yy === endy) {
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
			q.push(grid[xx][yy]);
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
