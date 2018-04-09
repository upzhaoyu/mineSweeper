function make2DArray(cols, rows){
    var arr = new Array(cols)
    for(var i=0; i<cols; i++){
        arr[i] = new Array(rows)
    }
    return arr
}

var grid
var cols
var rows
var w = 60
var totalBee = 20

function Cell(i, j, w){
    this.i = i
    this.j = j
    this.x = i * w
    this.y = j * w
    this.w = w
    this.neighborCount = 0
    this.revealed = false
}

Cell.prototype.show = function(){
    stroke(0)
    fill(255)
    rect(this.x, this.y, this.w, this.w)
    if(this.revealed){
        if (this.bee) {
            fill(0)
            this.gameOver()
            ellipse(this.x + this.w/2, this.y + this.w/2, this.w/2)
        } else {
            fill('yellow')
            rect(this.x, this.y, this.w, this.w)
            if ( this.neighborCount > 0 ) {
                textAlign(CENTER)
                fill(0)
                text(this.neighborCount, this.x + this.w/2, this.y + this.w/1.3)
            }

        }
    }
}

function setup(){
    createCanvas(601, 601)
    cols = floor(width / w)
    rows = floor(height / w)
    grid = make2DArray(cols, rows)
    for (var i=0; i< cols; i++ ) {
        for(var j=0; j< rows; j++){
            grid[i][j] = new Cell(i, j, w)
        }
    }

    let options = []
    for (var i = 0; i < cols; i++ ) {
        for ( var j = 0; j < rows; j++ ) {
            options.push([i, j])
        }
    }
    console.log(options)

    for ( var n = 0; n < totalBee; n++ ) {
        let index = floor(random(options.length))
        let choice = options[index]
        let i = choice[0]
        let j = choice[1]
        options.splice(index, 1)
        grid[i][j].bee = true
    }

    for (var i=0; i< cols; i++ ) {
        for(var j=0; j< rows; j++){
            grid[i][j].countBee()
        }
    }
}

function mousePressed () {
    for(var i = 0; i < cols; i++ ) {
        for(var j = 0; j < rows; j++ ) {
            if ( grid[i][j].contains(mouseX, mouseY) ){
                grid[i][j].reveal()
            }
        }
    }
}

function draw(){
    for (var i=0; i<cols; i++ ) {
        for(var j=0; j<rows; j++){
            grid[i][j].show()
        }
    }
}

Cell.prototype.gameOver = function(){
    for (var i = 0; i<cols; i++) {
        for(var j=0; j<rows; j++){
            grid[i][j].reveal()
        }
    }
}

Cell.prototype.countBee = function(){
    if (this.bee){
        this.neighborCount = -1
    }
    let totalNeighber = 0
    for ( var offsetX = -1; offsetX <= 1; offsetX++ ) {
        for ( var offsetY = -1; offsetY <= 1; offsetY++ ) {
            var i = this.i + offsetX
            var j = this.j + offsetY
            if ( -1 < i && i < cols && -1 < j && j < rows ) {
                var neighbor = grid[i][j]
                if( neighbor.bee ) {
                    totalNeighber ++
                } 
            }
        }
    }
    this.neighborCount = totalNeighber
}

Cell.prototype.contains = function(x, y){
    return (this.x < x && x < this.x + this.w && this.y < y && y < this.y + this.w)
}

Cell.prototype.reveal = function(){
    this.revealed = true
    if ( this.neighborCount === 0 ) {
        this.bloodFill()
    }
}

Cell.prototype.bloodFill = function(){
    for ( var offsetX = -1; offsetX <= 1; offsetX++ ) {
        for ( var offsetY = -1; offsetY <= 1; offsetY++ ) {
            var i = this.i + offsetX
            var j = this.j + offsetY
            if ( -1 < i && i < cols && -1 < j && j < rows ) {
                var neighbor = grid[i][j]
                if( !neighbor.bee && !neighbor.revealed ) {
                    neighbor.reveal()
                } 
            }
        }
    }
}