function sortNodesByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function calculateH(x, y, endNode, allowDiagnols) {
	let yy = (y - endNode.y) * (y - endNode.y);
	let xx = (x - endNode.x) * (x - endNode.x);
	let ans1 = Math.sqrt(xx + yy);
	let ans2 = Math.abs(x - endNode.x) + Math.abs(y - endNode.y);
	return allowDiagnols ? ans1 : ans2;
}

function greedybfs(startNode, endNode, grid, allowDiagnols) {
	let visitedNodes = [];
	let parentNodes = [];
	let [startx, starty] = [startNode.x, startNode.y];
	let [endx, endy] = [endNode.x, endNode.y];
	let q = [];
	startNode.isVisited = true;
	startNode.distance = 0;
	q.push(startNode);

	let { dirx, diry } = includeDiagnols(allowDiagnols);
	while (q.length > 0) {
		sortNodesByDistance(q);
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
			grid[xx][yy].parent = [curNode.x, curNode.y];
			grid[xx][yy].distance = calculateH(xx, yy, endNode, allowDiagnols);
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
			visitedNodes.push([xx, yy]);
			q.push(grid[xx][yy]);
		}
	}

	return [visitedNodes, parentNodes];
}

function includeDiagnols(allowDiagnols) {
	let dirx = [-1, 0, 1, 0];
	let diry = [0, -1, 0, 1];
	if (allowDiagnols === false) return { dirx, diry };
	else {
		dirx = [-1, -1, -1, 0, 0, 1, 1, 1];
		diry = [-1, 0, 1, -1, 1, -1, 0, 1];
		return { dirx, diry };
	}
}

export default greedybfs;
