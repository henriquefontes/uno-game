"use strict";

const amountOfCardsInDeck = 4
const colorsOfCards = ['blue', 'red', 'green', 'yellow']
const players = []
const playersDecks = {}
const trashDeck = []
const trashContainer = document.querySelector('.trash')
const $drawCard = document.querySelector('.card.buy')

let defaultTimerValue = 6
let currentTimerValue = defaultTimerValue
let currentPlayerIndexTurn = 0
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

const getLastTrashCard = () => {
  return trashDeck[trashDeck.length - 1]
}

const cardsEqualsLastTrashCard = (deck, number, color) => {
  if (trashDeck.length) {
    const equalsCards = deck.filter(({ cardNumber, cardColor }) => {
      return cardNumber == number || cardColor == color
    })
  
    return equalsCards
  }

  const equalsCards = deck
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
  renderDeckIntoDOM(playerName)
  resetTimer()
}

const throwCard = (playerName, throwingCardNumber, throwingCardColor) => {
  const playerDeck = playersDecks[playerName]
  
  const lastTrashCard = getLastTrashCard()

  if (lastTrashCard) {
    const {
      cardNumber: numberOfLastTrashCard, cardColor: colorOfLastTrashCard
    } = lastTrashCard
  
    const equalsCards = cardsEqualsLastTrashCard(
      playerDeck, numberOfLastTrashCard, colorOfLastTrashCard
    )
  
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
      resetTimer()

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
  resetTimer()

  
}

const botSelectPlay = () => {
  const botDeck = playersDecks[botCardDeck]
  
  const lastTrashCard = getLastTrashCard()
  const {
    cardNumber: numberOfLastTrashCard, cardColor: colorOfLastTrashCard
  } = lastTrashCard

  const equalsCards = cardsEqualsLastTrashCard(
    botDeck, numberOfLastTrashCard, colorOfLastTrashCard
  )

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
}

const handleCardHover = event => {
  const cardContainer = event.target
  const [ numberOfHoveredCard, colorOfHoveredCard ] = getDOMCardInfo(cardContainer)

  const lastTrashCard = getLastTrashCard()

  if (lastTrashCard) {
    const {
      cardNumber: numberOfLastTrashCard, cardColor: colorOfLastTrashCard
    } = lastTrashCard

    const hoveredCardEqualsLastTrashCard = cardsEqualsLastTrashCard(
      playersDecks[playerCardDeck], numberOfLastTrashCard, colorOfLastTrashCard
    ).some((({ cardNumber, cardColor }) =>
    cardNumber == numberOfHoveredCard && cardColor == colorOfHoveredCard))
  
    const styleCursor = hoveredCardEqualsLastTrashCard
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

const resetTimer = () => {
  currentTimerValue = defaultTimerValue

  const lastPlayerIndex = players.length - 1
  const value = currentPlayerIndexTurn == lastPlayerIndex ? 0 : currentPlayerIndexTurn + 1

  currentPlayerIndexTurn = value

  let currentPlayerTurn = players[currentPlayerIndexTurn]

  console.log(`Vez de: ${currentPlayerTurn}`)

  if (currentPlayerTurn == 'bot') {
    setTimeout(botSelectPlay, 2000)
  }
}

const timer = () => {
  let currentPlayerTurn = players[currentPlayerIndexTurn]
  
  const lastPlayerIndex = players.length - 1

  const $timer = document.querySelector('.timer-text')
  $timer.textContent = currentTimerValue

  if (currentTimerValue == 0) {
    if (currentPlayerIndexTurn == lastPlayerIndex) {
      currentPlayerIndexTurn = 0
      currentTimerValue = defaultTimerValue
      $timer.textContent = currentTimerValue

      console.log(`Vez de: ${currentPlayerTurn}`)

      if (currentPlayerTurn == 'bot') {
        setTimeout(botSelectPlay, 2000)
      }

      return
    }

    currentTimerValue = defaultTimerValue
    currentPlayerIndexTurn++
    $timer.textContent = currentTimerValue
    return
  }

  currentTimerValue--
  $timer.textContent = currentTimerValue
}

const startTimer = () => { setInterval(timer, 1000) }

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

renderDeckIntoDOM(playerCardDeck)
renderDeckIntoDOM(botCardDeck)

startTimer()

playerDOMcards.forEach(card => card.addEventListener('mouseover', handleCardHover))
playerDOMcards.forEach(card => card.addEventListener('click', handleCardClick))
$drawCard.addEventListener('click', handleDrawCardClick)