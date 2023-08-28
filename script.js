//10 x 25
let qntBombs = 30
let map = []
let playZone = document.getElementById('playingzone')
let firstClick = true

fillMap()
function fillMap(){
  for (let i = 0; i < 10; i++) {
    map[i] = []
    for (let j = 0; j < 25; j++) {
      let block = document.createElement('div')
      block.id = `${i},${j}`
      block.className = 'block'
      playZone.appendChild(block)
      map[i][j] = null
    }
  }
}


document.querySelectorAll('.block').forEach(element => {
  element.addEventListener('click',()=>{
    let elemLine = Number.parseInt(element.id.split(',')[0])
    let elemColumn = Number.parseInt(element.id.split(',')[1])
    if(firstClick){
      firstClick = false
      element.classList.add('white') 
      openFirstSpace(elemLine, elemColumn)
      plantbombs()
      calculateNumbers()
    }
    openSpace(elemLine, elemColumn)
  })

  element.addEventListener('contextmenu',(ev)=>{
    ev.preventDefault()
    let hasWarning = false
    let canBeWarning = true
    element.classList.forEach(e => {
      if(e === 'warning')
        hasWarning = true
      if(e === 'white')
        canBeWarning = false
    })
    if(canBeWarning){
      if(hasWarning){
        element.classList.remove('warning')
      }else{
        element.classList.add('warning')
      }
    }
    return false
  }, false)
})

function calculateNumbers(){
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 25; j++) {
      if(map[i][j] === null){
        let element = document.getElementById(`${i},${j}`)
        let bombsNearby = calculateBombsNearby(i,j, 'bomb')
        map[i][j] = bombsNearby
        if(bombsNearby !== 0){
          
          let paragraph = document.createElement('p')
          paragraph.innerText = `${bombsNearby}`
          element.appendChild(paragraph)
        }else{
          //map[i][j] = 'white'
        }
        
      }
    }
  }
}

function calculateBombsNearby(line, column, whatToSearch){  
  let bombsClose = 0

  bombsClose += (column != 0)?((line != 0)?((map[line - 1][column - 1] === whatToSearch)? 1: 0): 0): 0 //top left
  bombsClose += (column != 0)?((map[line][column - 1] === whatToSearch)? 1: 0): 0 //top middle
  bombsClose += (column != 0)?((line != 9)?((map[line + 1][column - 1] === whatToSearch)? 1: 0): 0): 0 //top right

  bombsClose += (line != 0)?((map[line - 1][column] === whatToSearch)? 1: 0): 0 // middle left
  bombsClose += (line != 9)?((map[line + 1][column] === whatToSearch)? 1: 0): 0 //middle right

  bombsClose += (column != 24)?((line != 0)?((map[line - 1][column + 1] === whatToSearch)? 1: 0): 0): 0 //bottom left
  bombsClose += (column!= 24)?((map[line][column + 1] === whatToSearch)? 1: 0): 0 //bottom middle
  bombsClose += (column != 24)?((line != 9)?((map[line + 1][column + 1] === whatToSearch)? 1: 0): 0): 0 //bottom right

  return bombsClose
}

function openSpace(line, column){
  let whitesNearby

  if(map[line][column] !== 'bomb'){
    let elem = document.getElementById(`${line},${column}`)
    elem.classList.add('white')

    if(map[line][column] === 0) map[line][column] = 'white'
  }else{
    loseGame()
  }

  do {
    whitesNearby = 0
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 25; j++) {
        if(calculateBombsNearby(i,j,'white') > 0){
          if(map[i][j] === 0){
            whitesNearby = 1
            map[i][j] = 'white'
          }
          let elem = document.getElementById(`${i},${j}`)
          elem.classList.add('white')
        }
      }
    }
  } while (whitesNearby != 0);
    
}

function loseGame(){
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 25; j++) {
      let elem = document.getElementById(`${i},${j}`)
      if(map[i][j] !== 'bomb'){
        elem.classList.add('white')
      }else{
        elem.classList.add('bomb')
      }
    }    
  }

  alert('you lose!')
}

function openFirstSpace(line, column){
  let whiteSpaces = 10
  map[line][column] = 'white'
  do {
    let randomLine = getRandomInt(0,10)
    let randomColumn = getRandomInt(0,25)
    if(checkSurroundings(randomLine,randomColumn,'white')){
      map[randomLine][randomColumn] = 'white'
      whiteSpaces--
      let block = document.getElementById(`${randomLine},${randomColumn}`)
      block.classList.add('white')
    }
  } while (whiteSpaces !== 0);
}

function plantbombs(){
  bombs = 45
  do {
    let randomLine = getRandomInt(0,10)
    let randomColumn = getRandomInt(0,25)
    if(checkSurroundingsBombs(randomLine, randomColumn, 'bomb')){
      map[randomLine][randomColumn] = 'bomb'
      bombs--
      // let block = document.getElementById(`${randomLine},${randomColumn}`)
      // block.classList.add('bomb')
    }
    
  } while (bombs != 0);
}

function checkSurroundings(line, column, whatToSearch){
  let toReduceLine = (line == 0)? 0: 1
  let toReduceColumn = (column == 0)? 0: 1
  let toIncreaseLine = (line == 9)? 0: 1
  let toIncreaseColumn = (column == 24)? 0: 1
  return (
    map[line][column] !== whatToSearch && (
    map[line][column - toReduceColumn] === whatToSearch ||
    map[line - toReduceLine][column] === whatToSearch ||
    map[line + toIncreaseLine][column] === whatToSearch ||
    map[line][column + toIncreaseColumn] === whatToSearch)
    )    
}

function checkSurroundingsBombs(line, column, whatToSearch){
  let bombsCloseLimit = 4

  return (
    (map[line][column] !== whatToSearch) &&
    (calculateBombsNearby(line, column, whatToSearch) < bombsCloseLimit) &&
    (calculateBombsNearby(line,column,'white') === 0)
  )
}

console.log(map)

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}