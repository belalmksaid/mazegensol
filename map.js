function rectangleB(c, x, y, w, h) { //draws empty rectange
	c.beginPath();
	c.rect(x, y, w, h);
	c.stroke();
}

function rectangleF(c, x, y, w, h) {
    c.beginPath();
	c.rect(x, y, w, h);
    c.fill();
}

function circleB(c, x, y, rad) {
	c.beginPath();
	c.arc(x, y, rad, 0, 2 * Math.PI, false);
	c.closePath();
	c.stroke();
}


const empty = "O";
const block = "#";
const path = "*";

const cellsize = 20;

var count = 0;

class map {
    constructor(dv, p, dim) {
        this.p = p; // probability that a cell is occupied
        this.dim = dim; // dimension of the map
        this.parent = dv; // where the map will be displayed
        this.cells = new Array(); // Will be used to store how the map looks like
        
    }

    create() {
        this.canvas = document.createElement("canvas"); // for visualisation purposes
        this.context = this.canvas.getContext('2d');// for visualisation purposes
        this.canvas.width = this.dim * cellsize;// for visualisation purposes
        this.canvas.height = this.dim * cellsize;// for visualisation purposes
        this.parent.append(this.canvas);// for visualisation purposes
        this.textDiv = document.createElement("div");// to print map text
        this.textDiv.style.display = "inline-block";// to print map text
        this.textDiv.style.fontFamily = "Courier";// to print map text
        this.parent.append(this.textDiv);// to print map text
        this.parent.append(document.createElement("br"));
    }    

    generate() {
        for(let i = 0; i < this.dim; i++) {
            this.cells[i] = new Array();
            for(let j = 0; j < this.dim; j++) {
                if((i == 0 && j == 0) || (i == this.dim - 1 && j == this.dim - 1))  {
                    this.cells[i][j] = empty;
                    continue;
                }
                this.cells[i][j] = Math.random() < this.p ? block : empty;
            }
        }
    }

    draw() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                if(this.cells[j][i] === empty) {
                    rectangleB(this.context, i * cellsize, j * cellsize, cellsize, cellsize);
                }
                else if(this.cells[j][i] === block) {
                    rectangleF(this.context, i * cellsize, j * cellsize, cellsize, cellsize);
                }
            }
        }
    }

    drawSolution(sol) {
        while(sol != undefined) {
            circleB(this.context, sol.j * cellsize + cellsize / 2, sol.i * cellsize + cellsize /2 , cellsize * 0.3);
            sol = sol.parent;
        }
    }

    text() {
        this.textDiv.innerHTML = "<br/>";
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                this.textDiv.innerHTML += this.cells[i][j] + "\t\t";
            }
            this.textDiv.innerHTML += "<br/>";
        }
    }

    textSolution(sol) {
        this.textDiv.innerHTML = "<br/>";
        let temp = this.cells.slice();
        for(let i = 0; i < temp.length; i++) {
            temp[i] = this.cells[i].slice();
        }
        while(sol != undefined) {
            temp[sol.i][sol.j] = path;
            sol = sol.parent;
        }
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                this.textDiv.innerHTML += temp[i][j] + "\t\t";
            }
            this.textDiv.innerHTML += "<br/>";
        }
    }

    outputtextSolution(sol) {
        let txt = "";
        let temp = this.cells.slice();
        for(let i = 0; i < temp.length; i++) {
            temp[i] = this.cells[i].slice();
        }
        while(sol != undefined) {
            temp[sol.i][sol.j] = path;
            sol = sol.parent;
        }
        for(let i = 0; i < this.dim; i++) {
            for(let j = 0; j < this.dim; j++) {
                txt += temp[i][j] + "\t";
            }
            txt += "<br/>";
        }
        return txt;
    }
};

function createUnvisitedMap(dim) {
    var arr = new Array();
    for(let i = 0; i < dim; i++) {
        arr[i] = new Array();
        for(let j = 0; j < dim; j++) {
            arr[i][j] = false;
        }
    }
    return arr;
}

class vector { // used to store the indices of the current cell, and a reference to the parent cell
    constructor(i, j, p) {
        this.i = i;
        this.j = j;
        this.parent = p;
    }
}

function v(i, j, p) { // creates a vector
    return new vector(i, j, p);
}

var ia = [-1, 0, 0, 1];
var ja = [0, -1, 1, 0];

function solveDFS(m) { // find goal node using DFS, return undefined if nothing found. This DFS checks down then right, then left, then up
    let stack = new Array();
    let visited = createUnvisitedMap(m.dim);
    let nodecount = 0;
    stack.push(v(0, 0)); // starting node
    let t0 = performance.now();
    while(stack.length > 0) {
        let index = stack.pop();
        nodecount++;
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                //console.log(performance.now() - t0);
                return [index, nodecount];
            }
            for(let i = 0; i < 4; i++) {
                let item = v(index.i + ia[i], index.j + ja[i], index);
                if(item.i >= 0 && item.j >= 0 && item.i < m.dim && item.j < m.dim) {
                    if(m.cells[item.i][item.j] != block) {
                        stack.push(item);
                    }
                }
            }
        }
    }
    return [undefined];
    //console.log(performance.now() - t0);
}

function solveBFS(m) { // find goal node using BFS, return undefined if nothing found
    let queue = new Array();
    let visited = createUnvisitedMap(m.dim);
    let nodecount = 0;
    queue.push(v(0, 0));
    //let t0 = performance.now();
    while(queue.length > 0) {
        let index = queue.shift();
        nodecount++;
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                //console.log(performance.now() - t0);
                return [index, nodecount];
            }
            for(let i = 0; i < 4; i++) {
                let item = v(index.i + ia[i], index.j + ja[i], index);
                if(item.i >= 0 && item.j >= 0 && item.i < m.dim && item.j < m.dim) {
                        if(m.cells[item.i][item.j] != block) {
                            queue.push(item);
                        }
                    }
                }
        }
    }
    return [undefined];
    //console.log(performance.now() - t0);
}

function insert(list, item, f) { // inserts item to a sorted list. Javascript doesn't have a built in sorted list and I don't want to keep resorting
    if(list.length < 1) {
        list.push(item);
        return;
    }
    let lo = 0;
    let hi = list.length - 1;
    let mid = Math.floor((lo + hi) / 2);
    while (hi > lo) {
        mid = Math.floor((lo + hi) / 2);
        if(f[list[mid].i][list[mid].j] == f[item.i][item.j]) {
            list.splice(mid, 0, item);
            return;
        }
        if(f[list[mid].i][list[mid].j] < f[item.i][item.j]) {
            lo = mid + 1;
        }
        else if(f[list[mid].i][list[mid].j] > f[item.i][item.j]) {
            hi = mid - 1;
        }
    }
    mid = Math.floor(Math.abs(lo + hi) / 2);
    if(f[list[mid].i][list[mid].j] < f[item.i][item.j])
        list.splice(mid + 1, 0, item);
    else
        list.splice(mid, 0, item);
}

function insertionSort(list, f) {
    var len = list.length;
    for (var i = 1; i < len; i++) {
        var tmp = list[i]; //Copy of the current element. 
        /*Check through the sorted part and compare with the number in tmp. If large, shift the number*/
        for (var j = i - 1; j >= 0 && (f[list[j].i][list[j].j] > f[tmp.i][tmp.j]); j--) {
            //Shift the number
            list[j + 1] = list[j];
        }
        //Insert the copied number at the correct position
        //in sorted part. 
        list[j + 1] = tmp;
    }
}

function euclideanHeuristic(a, b) {
    return Math.sqrt((b.i - a.i) * (b.i - a.i) + (b.j - a.j) * (b.j - a.j)); 
}

function manhattanHeuristic(a, b) {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function initializeGrid(dim) {
    var arr = new Array();
    for(let i = 0; i < dim; i++) {
        arr[i] = new Array();
        for(let j = 0; j < dim; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
}

function Astar(m, heu) { // heu is the heuristic function
    let open = new Array();
    let closed = createUnvisitedMap(m.dim);
    let opened = createUnvisitedMap(m.dim);
    let g = initializeGrid(m.dim);
    let h = initializeGrid(m.dim);
    let f = initializeGrid(m.dim);
    let t0 = performance.now();
    let goal = v(m.dim - 1, m.dim - 1);
    let nodecount = 0;
    g[0][0] = 0;
    h[0][0] = heu(path, goal);
    f[0][0] = g[0][0] + h[0][0];
    open.push(v(0, 0));
    opened[0][0] = true;
    closed[0][0] = true;
    while(open.length > 0) {
        let index = open.shift();
        opened[index.i][index.j] = false;
        closed[index.i][index.j] = true;
        if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
            //console.log(performance.now() - t0);
            return [index, nodecount];
        }
        for(let i = 0; i < 4; i++) {
                let item = v(index.i + ia[i], index.j + ja[i], index);
                if(item.i >= 0 && item.j >= 0 && item.i < m.dim && item.j < m.dim) {
                        if(m.cells[item.i][item.j] == block) continue;
                        let scost = g[index.i][index.j] + 1;
                        if(opened[item.i][item.j]) {
                            if(g[item.i][item.i] <= scost) continue;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insertionSort(open, f);
                            let ind = open.find(function(i) {
                                if(i.i == this[0] && i.j == this[1])
                                    return i;
                            }, [item.i, item.j]);
                            ind.parent = index;
                        }
                        else if(closed[item.i][item.j]) {
                            if(g[item.i][item.i] <= scost) continue;
                            closed[item.i][item.j] = false;
                            opened[item.i][item.j] = true;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insert(open, item, f);
                        }
                        else {
                            opened[item.i][item.j] = true;
                            nodecount++;
                            g[item.i][item.j] = scost;
                            h[item.i][item.j] = heu(item, goal);
                            f[item.i][item.j] = g[item.i][item.j] + h[item.i][item.j];
                            insert(open, item, f);
                        }
                        
                    }
                }
    }
    return [undefined];
    //console.log(performance.now() - t0);
}

// used to solve question 3
// dim is the dimension for the experiment
// dp is delta p
// pstart is the starting value of p
// pend is the ending value of p
// n is number of iterations
function experimentQ3(dim, dp, pstart, pend, n) {
    let result = "";
    for(let p = pstart; p <= pend; p+=dp) {
        let keep = 0;
        for(let i = 0; i < n; i++) {
            let m = new map([], p, dim);
            m.generate();
            if(solveDFS(m) != undefined) keep++;
        }
        console.log(keep);
        result = result + p + "\t" + keep + "\n";
    }
    return result;
}

// used to solve question 4 and 5
// dim is the dimension for the experiment
// dp is delta p
// pstart is the starting value of p
// pend is the ending value of p
// n is number of iterations
// solve is the method used to solve it
// usage: experimentQ4(100, 0.001, 0, 0.3005, 100, solveDFS)
function experimentQ4(dim, dp, pstart, pend, n, solve) {
    let result = "";
    for(let p = pstart; p <= pend; p+=dp) {
        let keep = 0;
        for(let i = 0; i < n; i++) {
            let m = new map([], p, dim);
            m.generate();
            if(solveDFS(m) == undefined) i--; // if a no solution map is found discard it/
            sol = solve(m);
            while(sol != undefined) {
                keep++;
                sol = sol.parent;
            }
        }
        console.log(p);
        result = result + p + "\t" + (keep / n) + "\n";
    }
    return result;
}

// Used for heuristic for Q8
function maxDistance(a, b) {
    return Math.max(euclideanHeuristic(a, b), manhattanHeuristic(a, b));
}

// Used for heuristic for Q8
function minDistance(a, b) {
    return Math.min(euclideanHeuristic(a, b), manhattanHeuristic(a, b));
}

// used to solve question 6 and 7, and parts a and b of 8
// dim is the dimension for the experiment
// dp is delta p
// pstart is the starting value of p
// pend is the ending value of p
// n is number of iterations
// solve is the method used to solve it
// usage: experimentQ67(100, 0.001, 0, 0.3005, 100, solveDFS)
function experimentQ67(dim, dp, pstart, pend, n, solve) {
    let result = "";
    for(let p = pstart; p <= pend; p+=dp) {
        let keep = 0;
        for(let i = 0; i < n; i++) {
            let m = new map([], p, dim);
            m.generate();
            if(solveDFS(m)[0] == undefined) {
                i--;
                continue;
            }
            let sol = solve(m);
            if(sol[0] != undefined) keep += sol[1];
        }
        result = result + p + "\t" + keep / n + "\n";
        console.log(p);
    }
    return result;
}

function alphaheu(a, b, alpha) {
    return alpha * euclideanHeuristic(a, b) + (1 - alpha) * manhattanHeuristic(a, b);
}

// used to solve parts c of Q 8
// dim is the dimension for the experiment
// dp is delta p
// pstart is the starting value of p
// pend is the ending value of p
// n is number of iterations
// da is how much alpha changes
// usage: experimentQ67(100, 0.001, 0, 0.3005, 100, solveDFS)
GLOBA = 0;
function experimentQ8Alpha(dim, dp, pstart, pend, da, n) {
    let result = "";
    for(let a = 0; a <= 1; a += da) {
        for(let p = pstart; p <= pend; p+=dp) {
            let keep = 0;
            for(let i = 0; i < n; i++) {
                let m = new map([], p, dim);
                m.generate();
                if(solveDFS(m)[0] == undefined) {
                    i--;
                    continue;
                }
                GLOBA = a;
                let sol = Astar(m, function(aa, bb) {
                    return alphaheu(aa, bb, GLOBA);
                });
                if(sol[0] != undefined) keep += sol[1];
            }
            result = result + p + "\t" + a + "\t" + (keep / n) + "\n";
            console.log(p);
        }
    }
    return result;
}

function betaheu(a, b, beta) {
    return  Math.pow(Math.pow(Math.abs(a.i - b.i), beta) + Math.pow(Math.abs(a.j - b.j), beta), 1.0 / beta);
}

GLOBB = 0;
function experimentQ8Beta(dim, dp, pstart, pend, db, n) {
    let result = "";
    for(let b = 1; b <= 2.005; b += db) {
        for(let p = pstart; p <= pend; p+=dp) {
            let keep = 0;
            for(let i = 0; i < n; i++) {
                let m = new map([], p, dim);
                m.generate();
                if(solveDFS(m)[0] == undefined) {
                    i--;
                    continue;
                }
                GLOBB = b;
                let sol = Astar(m, function(aa, bb) {
                    return betaheu(aa, bb, GLOBB);
                });
                if(sol[0] != undefined) keep += sol[1];
            }
            console.log(p);
            result = result + p + "\t" + GLOBB + "\t" + (keep / n) + "\n";
            
        }
    }
    return result;
}