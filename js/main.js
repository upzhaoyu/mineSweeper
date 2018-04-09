
function Cell (i, j){
    this.i = i
    this.j = j
    this.revealed = true
}

let totalBomb = 15
let w = 40
let singleGrid
let divWidth = 400
let divHeight = 400
let cols = divWidth / w
let rows = divHeight /w
let indexX
let indexY
let wrapper = document.getElementById('index-wrapper')

wrapper.style.width = divWidth + 'px'
wrapper.style.height = divHeight + 'px'
$(function(){
    $('#index-wrapper').click(function(event){
        let resetX = (window.innerWidth - divWidth)/2
        let resetY = (window.innerHeight - divHeight)/2
        let x = event.clientX - resetX
        let y = event.clientY - resetY
        indexY = parseInt(x/w) + 1
        indexX = parseInt(y/w) + 1
        console.log(indexX, indexY)
        let newGrid = new grid(indexX, indexY)
        if ( newGrid.isBomb() ) {
            gameOver()
        } else {
            newGrid.reveal()
            newGrid.writeNumber(countNeighborBomb(indexX, indexY))
        }
    })
})

let grid = function(x, y){
    this.route =  $('#index-wrapper dl').eq(x-1).children('dd').eq(y-1).children('p')
}

grid.prototype.reveal = function(){
    this.route.css({'display':'block'})
}

grid.prototype.smile = function(){
    this.route.css({'background-image':'url(images/smile.png)', 'display':'none'})  
}

grid.prototype.bomb = function(){
    this.route.css({'background-image':'url(images/bomb.jpg)', 'display':'none'})  
}

grid.prototype.isBomb = function(){
    if(this.route.css('background-image').slice(-10, -6) === 'bomb'){
        return true
    } else {
        return false
    }
}

grid.prototype.writeNumber = function(number){
    this.route.html(number)
}


let drawSquare = function(){
    for (var n = 0; n < rows; n++) {
        let creatDl = document.createElement('dl')
        wrapper.appendChild(creatDl)
    }
    for (var i = 0; i < rows; i++) {
        for(var j = 0; j < cols; j++){
            let creatDd = document.createElement('dd')
            creatDd.className = 'square'
            creatDd.style.width = (w-1) + 'px'
            creatDd.style.height = (w-1) + 'px'
            wrapper.children[j].appendChild(creatDd)
        }
    }
    let elementDd = document.getElementsByClassName('square')
    for(var n = 0; n < elementDd.length; n++){
        let creatP = document.createElement('p')
        creatP.style.lineHeight = w + 'px'
        creatP.style.width = (w-1) + 'px'
        creatP.style.height = (w-1) + 'px'
        elementDd[n].appendChild(creatP)
    }
    console.log(elementDd.length)
}

let showSmile = function(x, y){
    let showGrid = new grid(x, y)
    if( !showGrid.isBomb() ){
        showGrid.smile()
    }
}

let gameOver = function(){
    $('#index-wrapper dl').children('dd').children('p').css({'display':'block'})
}

let countNeighborBomb = function(x, y){
    let neighborBomb = 0;
    let newGrid2 = new grid(x, y)
    if ( !newGrid2.isBomb() ) {
        for (var n = -1; n <= 1; n++) {
            for (var m = -1; m <= 1; m++ ) {
                let boundaryX = x + n
                let boundaryY = y + m
                if ( 0 < boundaryX && boundaryX <= cols && 0 < boundaryY && boundaryY <= rows ){
                    let newGrid3 = new grid(boundaryX, boundaryY)
                    if( newGrid3.isBomb() ){
                        neighborBomb ++
                    }
                }
            } 
        }
    }
    return neighborBomb   
} 

function init(){

    drawSquare()
    let options = []
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            options.push([i, j])
        }
    }
    for (var n = 0; n < totalBomb; n++){
        let index = parseInt((Math.random()*options.length)+1)
        let choice = options[index]
        let i = choice[0]
        let j = choice[1]
        options.splice(index, 1)
        let drawBomb = new grid(i, j)
        drawBomb.bomb()
    }
    
    for (var i= 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            showSmile(i, j)
        }
    }
}
init()

