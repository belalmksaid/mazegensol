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
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.dim * cellsize;
        this.canvas.height = this.dim * cellsize;
        this.parent.append(this.canvas);
        this.textDiv = document.createElement("div");
        this.textDiv.style.display = "inline-block";
        this.textDiv.style.fontFamily = "Courier";
        this.parent.append(this.textDiv);
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

class vector {
    constructor(i, j, p) {
        this.i = i;
        this.j = j;
        this.parent = p;
    }
}

function v(i, j, p) {
    return new vector(i, j, p);
}

function solveDFS(m) {
    let stack = new Array();
    let visited = createUnvisitedMap(m.dim);
    stack.push(v(0, 0));
    while(stack.length > 0) {
        let index = stack.pop();
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                return index;
            }
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == j || i == -j) continue;
                    if(index.i + i >= 0 && index.j + j >= 0 && index.i + i < m.dim && index.j + j < m.dim) {
                        let item = v(index.i + i, index.j + j, index);
                        if(m.cells[item.i][item.j] != block)
                            stack.push(item);
                    }
                }
            }
        }
    }
}

function solveBFS(m) {
    let queue = new Array();
    let visited = createUnvisitedMap(m.dim);
    queue.push(v(0, 0));
    while(queue.length > 0) {
        let index = queue.shift();
        if(!visited[index.i][index.j]) {
            visited[index.i][index.j] = true;
            if(index.i + 1 == m.dim && index.j + 1 == m.dim) {
                return index;
            }
            for(let i = -1; i <= 1; i++) {
                for(let j = -1; j <= 1; j++) {
                    if(i == j || i == -j) continue;
                    if(index.i + i >= 0 && index.j + j >= 0 && index.i + i < m.dim && index.j + j < m.dim) {
                        let item = v(index.i + i, index.j + j, index);
                        if(m.cells[item.i][item.j] != block)
                            queue.push(item);
                    }
                }
            }
        }
    }
}