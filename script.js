const amountOfCardsInDeck = 4
const colorsOfCards = ['blue', 'red', 'green', 'yellow']
const playersDecks = {}

let playerDOMcards = ''
let trashDOMcards = document.querySelectorAll('[data-js="trash"]')

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

  playersDecks[playerName] = newDeck

  return playerName
}
 
const addDeckIntoDOM = playerName => {
  const isPlayerDeck = playerName == 'player'
  const deck = playersDecks[playerName]

  const deckContainer = document.querySelector(`.${isPlayerDeck
    ? 'player-deck'
    : 'bot-deck'}`)

  const deckToHTML = deck.map(({ cardNumber, cardColor }) => {
    return `
      <div class="card ${isPlayerDeck ? cardColor : 'hidden'}"
      ${isPlayerDeck  ?`data-js="${cardNumber}-${cardColor}"` : ''}>
        <span>${isPlayerDeck ? cardNumber : ''}</span>
      </div>
    `
  }).join('')

  deckContainer.innerHTML += deckToHTML

  playerDOMcards = document.querySelectorAll('.player-deck .card')
  playerDOMcards.forEach(card => card.addEventListener('mouseover', handleHoverCard(card)))
  playerDOMcards.forEach(card => card.addEventListener('click', handleClickCard))
}

const updateDeckIntoDOM = playerName => {
  const isPlayerDeck = playerName == 'player'
  const deck = playersDecks[playerName]

  const deckContainer = document.querySelector(`.${isPlayerDeck
    ? 'player-deck'
    : 'bot-deck'}`)

  const deckToHTML = deck.map(({ cardNumber, cardColor }) => {
    return `
      <div class="card ${isPlayerDeck ? cardColor : 'hidden'}"
      ${isPlayerDeck  ?`data-js="${cardNumber}-${cardColor}"` : ''}>
        <span>${isPlayerDeck ? cardNumber : ''}</span>
      </div>
    `
  }).join('')

  deckContainer.innerHTML = deckToHTML

  playerDOMcards = document.querySelectorAll('.player-deck .card')
  playerDOMcards.forEach(card => card.addEventListener('mouseover', handleHoverCard(card)))
  playerDOMcards.forEach(card => card.addEventListener('click', handleClickCard))
}

const equalCardsInDeck = (deck, number, color) => {
  const equalsCards = deck.filter(({ cardNumber, cardColor }) => {
    return cardNumber == number || cardColor == color
  })

  return equalsCards
}

const throwCard = (playerName, throwingCardNumber, throwingCardColor) => {
  const playerDeck = playersDecks[playerName]

  const lastTrashCard = trashDOMcards[trashDOMcards.length - 1]
  const classesOfLastTrashCard = lastTrashCard.getAttribute('data-trash').split('-')

  const [ numberOfLastTrashCard, colorOfLastTrashCard ] = classesOfLastTrashCard

  const equalsCards = equalCardsInDeck(playerDeck, numberOfLastTrashCard, colorOfLastTrashCard)

  const equalsCardsIncludesThrowingCard = equalsCards
  .some((({ cardNumber, cardColor }) =>
      cardNumber == throwingCardNumber || cardColor == throwingCardColor))

  const throwingCardIndex = playerDeck.findIndex(({ cardNumber, cardColor }) =>
    cardNumber == throwingCardNumber && cardColor == throwingCardColor)

  if (equalsCardsIncludesThrowingCard) {
    playerDeck.splice(throwingCardIndex, 1)

    return updateDeckIntoDOM(playerName)
  }

  return
}

const handleHoverCard = card => {
  card.style.cursor = 'cursor'
}

const handleClickCard = event => {
  const classesOfClickedCard = event.target.getAttribute('data-js').split('-')

  const [ numberOfClickedCard, colorOfClickedCard ] = classesOfClickedCard

  console.log(numberOfClickedCard, colorOfClickedCard)

  throwCard('player', numberOfClickedCard, colorOfClickedCard)
}

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

addDeckIntoDOM(playerCardDeck)
addDeckIntoDOM(botCardDeck)

playerDOMcards.forEach(card => card.addEventListener('mouseover', handleHoverCard(card)))
playerDOMcards.forEach(card => card.addEventListener('click', handleClickCard))

