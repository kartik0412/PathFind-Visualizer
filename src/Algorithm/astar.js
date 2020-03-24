function sortNodesByDistance(unvisitedNodes) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function createNode(x, y) {
	return {
		x: x,
		y: y,
		parent: null,
		isVisited: false,
		g: Infinity,
		f: Infinity,
		h: Infinity
	};
}

function includeDiagnols(allowDiagnols) {
	let dirx = [1, 0, -1, 0];
	let diry = [0, 1, 0, -1];
	if (allowDiagnols === false) return { dirx, diry };
	else {
		dirx = [-1, -1, -1, 0, 0, 1, 1, 1];
		diry = [-1, 0, 1, -1, 1, -1, 0, 1];
		return { dirx, diry };
	}
}

function createGrid(grid) {
	let mat = [];
	for (let i = 0; i < grid.length; i++) {
		let x = [];
		for (let j = 0; j < grid[0].length; j++) {
			x.push(createNode(i, j));
		}
		mat.push(x);
	}
	return mat;
}

function calculateH(x, y, endNode, allowDiagnols) {
	let yy = (y - endNode.y) * (y - endNode.y);
	let xx = (x - endNode.x) * (x - endNode.x);
	let ans1 = Math.sqrt(xx + yy);
	let ans2 = Math.abs(x - endNode.x) + Math.abs(y - endNode.y);
	return allowDiagnols ? ans1 : ans2;
}

function astar(startNode, endNode, grid, allowDiagnols) {
	let visitedNodes = [];
	let parentNodes = [];

	let mat = createGrid(grid);

	mat[startNode.x][startNode.y].isVisited = true;
	mat[startNode.x][startNode.y].g = 0;
	mat[startNode.x][startNode.y].h = 0;
	mat[startNode.x][startNode.y].f = 0;
	let q = [];
	let { dirx, diry } = includeDiagnols(allowDiagnols);
	q.push(mat[startNode.x][startNode.y]);
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
				grid[xx][yy].isWall === true ||
				mat[xx][yy].isVisited === true
			)
				continue;
			mat[xx][yy].isVisited = true;
			let gNew = 1 + curNode.g;
			let hNew = calculateH(xx, yy, endNode, allowDiagnols);
			let fNew = gNew + hNew;
			if (mat[xx][yy].f === Infinity || mat[xx][yy].f > fNew) {
				mat[xx][yy].f = fNew;
				mat[xx][yy].g = gNew;
				mat[xx][yy].h = hNew;
				mat[xx][yy].parent = [curNode.x, curNode.y];
				q.push(mat[xx][yy]);
			}
			if (grid[xx][yy] === endNode) {
				console.log("From A Star");
				let x = xx;
				let y = yy;
				while (mat[x][y].parent != null) {
					parentNodes.push([x, y]);
					[x, y] = mat[x][y].parent;
				}
				parentNodes.push([startNode.x, startNode.y]);
				return [visitedNodes, parentNodes];
			}
			visitedNodes.push([xx, yy]);
		}
		sortNodesByDistance(q);
	}

	return [visitedNodes, parentNodes];
}

export default astar;
