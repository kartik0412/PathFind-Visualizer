let dirx = [1, 0, -1, 0];
let diry = [0, 1, 0, -1];
let grid = [];

function solve(x, y, endx, endy, visitedNodes) {
	if (x === endx && y === endy) return 1;

	for (let i = 0; i < dirx.length; i++) {
		let xx = x + dirx[i];
		let yy = y + diry[i];
		if (
			xx < 0 ||
			yy < 0 ||
			xx >= grid.length ||
			yy >= grid[0].length ||
			grid[xx][yy].isWall === true ||
			grid[xx][yy].isVisited === true
		)
			continue;
		visitedNodes.push([xx, yy]);
		grid[xx][yy].isVisited = true;
		grid[xx][yy].parent = grid[x][y];
		if (solve(xx, yy, endx, endy, visitedNodes)) return 1;
	}
	return 0;
}

function dfs(startNode, endNode, stateGrid) {
	let visitedNodes = [];
	let parentNodes = [];
	grid = stateGrid;
	let found = solve(startNode.x, startNode.y, endNode.x, endNode.y, visitedNodes);
	let node = grid[endNode.x][endNode.y];
	while (node.parent != null) {
		parentNodes.push([node.x, node.y]);
		node = node.parent;
	}
	if (found) parentNodes.push([startNode.x, startNode.y]);
	console.log(parentNodes.length);
	return [visitedNodes, parentNodes];
}

export default dfs;
