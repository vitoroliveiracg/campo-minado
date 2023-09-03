//10 x 25
let qntBombs = 45
let bombsCloseLimit = 4
let firstsWhiteSpaces = 10

let amountLines = 10
let amountColumns = 25
let blockSize = 35
let playZoneSizeHeight = 350
let playZoneSizeWidth = 875
let root = document.querySelector(':root')

let map = []
let playZone = document.getElementById('playingzone')
let firstClick = true
let losed = false
let winned = false

let intervalTimer
let counter = 0

reloadGame()
function loadGame(){
  let dificult =  document.querySelector('#dificult')

  switch (dificult.selectedIndex) {
    case 0: //easy
      qntBombs = 30
      bombsCloseLimit = 2
      firstsWhiteSpaces = 20

      amountLines = 10
      amountColumns = 25
      blockSize = 35
      playZoneSizeHeight = 350
      playZoneSizeWidth = 875
      break
    case 1: //normal
      qntBombs = 75
      bombsCloseLimit = 4
      firstsWhiteSpaces = 10

      amountLines = 20
      amountColumns = 35
      blockSize = 25
      playZoneSizeHeight = 500
      playZoneSizeWidth = 875
      break
    case 2: //hard
      qntBombs = 190
      bombsCloseLimit = 5
      firstsWhiteSpaces = 7

      amountLines = 35
      amountColumns = 35
      blockSize = 25
      playZoneSizeHeight = 875
      playZoneSizeWidth = 875
      break
  }

}

document.querySelector('#reload').addEventListener('click',reloadGame)

function reloadGame(){
  loadGame()

  root.style.setProperty('--block-height',`${blockSize}px`)
  root.style.setProperty('--block-width',`${blockSize}px`)

  root.style.setProperty('--playing-zone-height',`${playZoneSizeHeight}px`)
  root.style.setProperty('--playing-zone-width',`${playZoneSizeWidth}px`)

  stopTimer(intervalTimer)
  resetTimer()
  counter = 0
  playZone.innerHTML = ''
  map = []
  firstClick = true
  losed = false
  winned = false
  fillMap()
  loadBlocks()
}


function fillMap(){
  for (let i = 0; i < amountLines; i++) {
    map[i] = []
    for (let j = 0; j < amountColumns; j++) {
      let block = document.createElement('div')
      block.id = `${i},${j}`
      block.className = 'block'
      playZone.appendChild(block)  
      map[i][j] = null
    }
  }
}

function loadBlocks(){
  document.querySelectorAll('.block').forEach(element => {
    element.addEventListener('click',()=>{
      if(losed !== true && winned !== true){
        let elemLine = Number.parseInt(element.id.split(',')[0])
        let elemColumn = Number.parseInt(element.id.split(',')[1])
        if(firstClick){
          firstClick = false
          element.classList.add('white') 
          openFirstSpace(elemLine, elemColumn)
          plantbombs()
          calculateNumbers()
          startTimer()
        }
        openSpace(elemLine, elemColumn)
        winGame()
      }
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
}


function startTimer(){
  let timer = document.querySelector('#timer')


  intervalTimer = setInterval(() => {
      if(counter <= 999)
        counter++
      timer.innerText = String(counter).padStart(3,0)
  }, 1000);

}

function resetTimer(){
  let timer = document.querySelector('#timer')
  timer.innerText = '000'
}

function stopTimer(){
  clearInterval(intervalTimer)
}

function winGame(){
  if(losed !== true){
    let count = 0
    for (let i = 0; i < amountLines; i++) {
      for (let j = 0; j < amountColumns; j++) {
        let elem = document.getElementById(`${i},${j}`)
        if(elem.classList.contains('white') || map[i][j] === 'bomb'){
          count++
        }
      }
    }
    if(count == (amountLines * amountColumns)){
      winned = true
      stopTimer()
      alert('YOU WIN!')
    }
  }
}

function calculateNumbers(){
  for (let i = 0; i < amountLines; i++) {
    for (let j = 0; j < amountColumns; j++) {
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
  let limitLine = (amountLines - 1)
  let limitColumn = (amountColumns - 1)

  bombsClose += (column != 0)?((line != 0)?((map[line - 1][column - 1] === whatToSearch)? 1: 0): 0): 0 //top left
  bombsClose += (column != 0)?((map[line][column - 1] === whatToSearch)? 1: 0): 0 //top middle
  bombsClose += (column != 0)?((line != limitLine)?((map[line + 1][column - 1] === whatToSearch)? 1: 0): 0): 0 //top right

  bombsClose += (line != 0)?((map[line - 1][column] === whatToSearch)? 1: 0): 0 // middle left
  bombsClose += (line != limitLine)?((map[line + 1][column] === whatToSearch)? 1: 0): 0 //middle right

  bombsClose += (column != limitColumn)?((line != 0)?((map[line - 1][column + 1] === whatToSearch)? 1: 0): 0): 0 //bottom left
  bombsClose += (column!= limitColumn)?((map[line][column + 1] === whatToSearch)? 1: 0): 0 //bottom middle
  bombsClose += (column != limitColumn)?((line != limitLine)?((map[line + 1][column + 1] === whatToSearch)? 1: 0): 0): 0 //bottom right

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
    for (let i = 0; i < amountLines; i++) {
      for (let j = 0; j < amountColumns; j++) {
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
  if(winned !== true){
    for (let i = 0; i < amountLines; i++) {
      for (let j = 0; j < amountColumns; j++) {
        let elem = document.getElementById(`${i},${j}`)
        if(map[i][j] !== 'bomb'){
          elem.classList.add('white')
        }else{
          elem.classList.add('bomb')
        }
      }    
    }
  
    stopTimer()
    losed = true
    alert('you lose!')
  }
}

function openFirstSpace(line, column){
  let whiteSpaces = firstsWhiteSpaces
  map[line][column] = 'white'
  do {
    let randomLine = getRandomInt(0,amountLines)
    let randomColumn = getRandomInt(0,amountColumns)
    if(checkSurroundings(randomLine,randomColumn,'white')){
      map[randomLine][randomColumn] = 'white'
      whiteSpaces--
      let block = document.getElementById(`${randomLine},${randomColumn}`)
      block.classList.add('white')
    }
  } while (whiteSpaces !== 0);
}

function plantbombs(){
  bombs = qntBombs
  do {
    let randomLine = getRandomInt(0,amountLines)
    let randomColumn = getRandomInt(0,amountColumns)
    if(checkSurroundingsBombs(randomLine, randomColumn, 'bomb')){
      map[randomLine][randomColumn] = 'bomb'
      bombs--
    }
    
  } while (bombs != 0);
}

function checkSurroundings(line, column, whatToSearch){
  let toReduceLine = (line == 0)? 0: 1
  let toReduceColumn = (column == 0)? 0: 1
  let toIncreaseLine = (line == (amountLines - 1))? 0: 1
  let toIncreaseColumn = (column == (amountColumns - 1))? 0: 1
  return (
    map[line][column] !== whatToSearch && (
    map[line][column - toReduceColumn] === whatToSearch ||
    map[line - toReduceLine][column] === whatToSearch ||
    map[line + toIncreaseLine][column] === whatToSearch ||
    map[line][column + toIncreaseColumn] === whatToSearch)
    )    
}

function checkSurroundingsBombs(line, column, whatToSearch){
  return (
    (map[line][column] !== whatToSearch) &&
    (calculateBombsNearby(line, column, whatToSearch) < bombsCloseLimit) &&
    (calculateBombsNearby(line,column,'white') === 0)
  )
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}