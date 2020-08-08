import bfs from "./bfs";
import dijkstra from "./dijkstra";
import astar from "./astar";
import greedybfs from "./greedybfs";
import dfs from "./dfs";

function algorithm(startNode, endNode, grid, value, allowDiagnols) {
	if (value === 1) return astar(startNode, endNode, grid, allowDiagnols);
	else if (value === 2) return dijkstra(startNode, endNode, grid, allowDiagnols);
	else if (value === 3) return greedybfs(startNode, endNode, grid, allowDiagnols);
	else if (value === 4) return bfs(startNode, endNode, grid, allowDiagnols);
	else return dfs(startNode, endNode, grid, allowDiagnols);
}

export default algorithm;
