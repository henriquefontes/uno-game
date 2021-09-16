"use strict";

const trashContainer = document.querySelector('.trash')
const $drawCard = document.querySelector('.card.buy')
const playersDecks = {}
const players = []
const trashDeck = []
const colorsOfCards = ['blue', 'red', 'green', 'yellow']
const amountOfCardsInDeck = 4

let playerDOMcards = ''

const createCardDeck = playerName => {
  const newDeck = []

  for (let i = 0; i < amountOfCardsInDeck; i++) {
    const randomCardNumber = Math.floor(Math.random() * 9)
    const randomColor = Math.floor(Math.random() * colorsOfCards.length)

    const card = {
      cardNumber: randomCardNumber,
      cardColor: colorsOfCards[randomColor]
    }

    newDeck.push(card)
  }

  players.push(playerName)
  playersDecks[playerName] = newDeck

  return playerName
}

const translateDrawCard = () => {
  $drawCard.style.transform = 'translateX(-50%)'
}

const renderDeckIntoDOM = playerName => {
  const isPlayerDeck = playerName == 'player'
  const deck = playersDecks[playerName]

  const deckContainer = document.querySelector(`.${isPlayerDeck
    ? 'player-deck'
    : 'bot-deck'}`)

  const deckToHTML = deck.map(({ cardNumber, cardColor }) => {
    return `
      <div class="card ${isPlayerDeck ? cardColor : 'hidden'}"
      ${isPlayerDeck  ?`data-js="${cardNumber}-${cardColor}"` : ''}>
        <span>${isPlayerDeck ? cardNumber : 'uno'}</span>
      </div>
    `
  }).join('')

  deckContainer.innerHTML = deckToHTML

  playerDOMcards = document.querySelectorAll('.player-deck .card')
  playerDOMcards.forEach(card => card.addEventListener('mouseover', handleCardHover))
  playerDOMcards.forEach(card => card.addEventListener('click', handleCardClick))
}

const renderTrashIntoDOM = () => {
  const trashCardsToHTML = trashDeck.map(({ cardNumber, cardColor }) => {
    return `
      <div class="card ${cardColor} trash" data-trash="true" data-js="${cardNumber}-${cardColor}">
        <span>${cardNumber}</span>
      </div>
    `
  }).join('')

  trashContainer.innerHTML = trashCardsToHTML
}

const getDOMCardInfo = card => {
  const classesOfCard = card.getAttribute('data-js').split('-')
  const [ numberOfCard, colorOfCard ] = classesOfCard

  return [
    numberOfCard,
    colorOfCard
  ]
}

const getLastCard = () => {
  return trashDeck[trashDeck.length - 1]
}

const cardsEqualsLastCard = deck => {
  if (trashDeck.length) {
    const { cardNumber: number, cardColor: color } = getLastCard()

    const equalsCards = deck.filter(({ cardNumber, cardColor }) => {
      return cardNumber == number || cardColor == color
    })
  
    return equalsCards
  }

  const equalsCards = deck

  return equalsCards
}

const createCard = () => {
  const randomCardNumber = Math.floor(Math.random() * 9)
  const randomCardColor = Math.floor(Math.random() * colorsOfCards.length)
  const randomCard = {
    cardNumber: randomCardNumber,
    cardColor: colorsOfCards[randomCardColor]
  }

  return randomCard
}

const drawCard = playerName => {
  const deck = playersDecks[playerName]
  const newCard = createCard()

  console.log(`Adicionando carta: ${newCard.cardNumber}-${newCard.cardColor}, ao deck de: ${playerName}`)

  deck.push(newCard)
  changePlayerTurn()
  renderDeckIntoDOM(playerName)
  
}

const throwCard = (playerName, throwingCardNumber, throwingCardColor) => {
  const playerDeck = playersDecks[playerName]
  
  const lastCard = getLastCard()

  if (lastCard) {
    const equalsCards = cardsEqualsLastCard(playerDeck)
  
    const equalsCardsIncludesThrowingCard = equalsCards
    .some((({ cardNumber, cardColor }) =>
        cardNumber == throwingCardNumber && cardColor == throwingCardColor))
  
    const throwingCardIndex = playerDeck.findIndex(({ cardNumber, cardColor }) =>
      cardNumber == throwingCardNumber && cardColor == throwingCardColor)
  
    if (equalsCardsIncludesThrowingCard) {
      trashDeck.push(playerDeck[throwingCardIndex])
      playerDeck.splice(throwingCardIndex, 1)
  
      console.log(`Dropando carta: ${throwingCardNumber}-${throwingCardColor} de: ${playerName}`)

      renderDeckIntoDOM(playerName)
      renderTrashIntoDOM()
      changePlayerTurn()

      return
    }

    return
  }

  const throwingCardIndex = playerDeck.findIndex(({ cardNumber, cardColor }) =>
  cardNumber == throwingCardNumber && cardColor == throwingCardColor)

  trashDeck.push(playerDeck[throwingCardIndex])
  playerDeck.splice(throwingCardIndex, 1)

  console.log(`Dropando carta: ${throwingCardNumber}-${throwingCardColor} de: ${playerName}`)

  translateDrawCard()
  renderDeckIntoDOM(playerName)
  renderTrashIntoDOM()
  changePlayerTurn()
}

const botSelectPlay = () => {
  const botDeck = playersDecks[botCardDeck]
  
  const lastCard = getLastCard()
  
  if (lastCard) {
    const {
      cardNumber: numberOfLastCard, cardColor: colorOfLastCard
    } = lastCard
  
    const equalsCards = cardsEqualsLastCard(botDeck)
  
    console.log(equalsCards)

    const haveCardToThrow = equalsCards.length
  
    if (haveCardToThrow) {
      const randomCardIndex = Math.floor(Math.random() * equalsCards.length)
      const randomCardToThrow = equalsCards[randomCardIndex]
      const {
        cardNumber: randomCardNumber, cardColor: randomCardColor
      } = randomCardToThrow
    
      throwCard(botCardDeck, randomCardNumber, randomCardColor)
  
      return
    }

    drawCard(botCardDeck)

    return
  }

  const equalsCards = cardsEqualsLastCard(botDeck)

  const randomCardIndex = Math.floor(Math.random() * equalsCards.length)
  const randomCardToThrow = equalsCards[randomCardIndex]
  const {
    cardNumber: randomCardNumber, cardColor: randomCardColor
  } = randomCardToThrow
    
  throwCard(botCardDeck, randomCardNumber, randomCardColor)

}

const handleCardHover = event => {
  const cardContainer = event.target
  const [ numberOfHoveredCard, colorOfHoveredCard ] = getDOMCardInfo(cardContainer)

  const lastCard = getLastCard()

  if (lastCard) {
    const hoveredCardEqualsLastCard = cardsEqualsLastCard(playersDecks[playerCardDeck])
    .some((({ cardNumber, cardColor }) =>
    cardNumber == numberOfHoveredCard && cardColor == colorOfHoveredCard))
  
    const styleCursor = hoveredCardEqualsLastCard
      ? cardContainer.style.cursor = "pointer"
      : cardContainer.style.cursor = "not-allowed"
    
    return
  }

  cardContainer.style.cursor = "pointer"
}

const handleCardClick = event => {
  const cardContainer = event.target
  const [ numberOfClickedCard, colorOfClickedCard ] = getDOMCardInfo(cardContainer)

  throwCard(playerCardDeck, numberOfClickedCard, colorOfClickedCard)
}

const handleDrawCardClick = () => {
  drawCard(playerCardDeck)
}

const timer = timerValue => {
  const timerDefaultValue = timerValue
  let timerInterval
  
  const start = callback => {
    let currentTimerValue = timerDefaultValue

    const decreaseTimerValue = () => {
      currentTimerValue--

      callback(currentTimerValue)
    }
    
    timerInterval = setInterval(decreaseTimerValue, 1000)

  }
  
  const stop = () => {
    clearInterval(timerInterval)
  }
  
  const reset = () => {
    clearInterval(timerInterval)
  }
  
  return {
    start,
    stop,
  }
}

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

const turnTimer = timer(6)
const $turnTimer = document.querySelector('.timer-text')

let currentPlayerIndex = 0
let currentPlayer = players[currentPlayerIndex]
const lastPlayerIndex = players.length - 1

const changePlayerTurn = () => {
  const $turnText = document.querySelector('.turn-text')

  turnTimer.stop()
  turnTimer.start(turnTimerStart)

  currentPlayerIndex++
  currentPlayer = players[currentPlayerIndex]
  $turnText.textContent = `Vez de: ${currentPlayer}`

  if (currentPlayerIndex > lastPlayerIndex) {
    currentPlayerIndex = 0
    currentPlayer = players[currentPlayerIndex]
    $turnText.textContent = `Vez de: ${currentPlayer}`
  }

  if (currentPlayer == 'bot') {
    setTimeout(botSelectPlay, 4000)
  }
  
}

const turnTimerStart = currentTimerValue => {
  $turnTimer.textContent = currentTimerValue

  if (currentTimerValue == 0) {
    changePlayerTurn()
  }
}


turnTimer.start(turnTimerStart)

renderDeckIntoDOM(playerCardDeck)
renderDeckIntoDOM(botCardDeck)

playerDOMcards.forEach(card => card.addEventListener('mouseover', handleCardHover))
playerDOMcards.forEach(card => card.addEventListener('click', handleCardClick))
$drawCard.addEventListener('click', handleDrawCardClick)