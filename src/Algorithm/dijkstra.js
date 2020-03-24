function sortNodesByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
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

function newNode(x, y, distance, parent) {
	return {
		x: x,
		y: y,
		distance: distance,
		parent: parent
	};
}

function dijkstra(startNode, endNode, grid, allowDiagnols) {
	let visitedNodes = [];
	let parentNodes = [];
	let q = [];
	let dis = new Array(grid.length);
	for (let i = 0; i < grid.length; i++) {
		dis[i] = new Array(grid[0].length);
		for (let j = 0; j < grid[0].length; j++) {
			dis[i][j] = Infinity;
		}
	}
	let { dirx, diry } = includeDiagnols(allowDiagnols);
	q.push(newNode(startNode.x, startNode.y, 0, null));
	dis[startNode.x][startNode.y] = 0;

	while (q.length > 0) {
		let curNode = q.shift();
		for (let i = 0; i < dirx.length; i++) {
			let xx = curNode.x + dirx[i];
			let yy = curNode.y + diry[i];

			if (xx < 0 || yy < 0 || xx >= grid.length || yy >= grid[0].length || grid[xx][yy].isWall === true) continue;

			if (dis[xx][yy] > 1 + curNode.distance) {
				dis[xx][yy] = 1 + curNode.distance;
				q.push(newNode(xx, yy, dis[xx][yy], curNode));
				visitedNodes.push([xx, yy]);
			}
			if (xx === endNode.x && yy === endNode.y) {
				console.log("From Dijkstra");
				visitedNodes.pop();
				let node = newNode(xx, yy, dis[xx][yy], curNode);
				while (node.parent != null) {
					parentNodes.push([node.x, node.y]);
					node = node.parent;
				}
				parentNodes.push([startNode.x, startNode.y]);
				console.log(parentNodes.length);
				return [visitedNodes, parentNodes];
			}
		}
		sortNodesByDistance(q);
	}
}

export default dijkstra;
