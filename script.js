const amountOfCardsInDeck = 4
const colorsOfCards = ['blue', 'red', 'green', 'yellow']
const playersDecks = {}
const trashDeck = []
const trashContainer = document.querySelector('.trash')
const $buyCard = document.querySelector('.card.buy')

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

  playersDecks[playerName] = newDeck

  return playerName
}

const translateBuyCard = () => {
  $buyCard.style.transform = 'translateX(-50%)'
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
        <span>${isPlayerDeck ? cardNumber : ''}</span>
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

const buyCard = playerName => {
  const deck = playersDecks[playerName]
  const newCard = createCard()

  deck.push(newCard)
  renderDeckIntoDOM(playerName)
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
  
      renderDeckIntoDOM(playerName)
      renderTrashIntoDOM()
  
      return
    }

    return
  }

  const throwingCardIndex = playerDeck.findIndex(({ cardNumber, cardColor }) =>
  cardNumber == throwingCardNumber && cardColor == throwingCardColor)

  trashDeck.push(playerDeck[throwingCardIndex])
  playerDeck.splice(throwingCardIndex, 1)

  translateBuyCard()
  renderDeckIntoDOM(playerName)
  renderTrashIntoDOM()
  
}

const botSelectCardToThrow = () => {
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
  
    throwCard('bot', randomCardNumber, randomCardColor)

    return
  }
  
}

const handleCardHover = event => {
  const cardContainer = event.target
  const [ numberOfHoveredCard, colorOfHoveredCard ] = getDOMCardInfo(cardContainer)

  const lastTrashCard = getLastTrashCard()

  console.log(lastTrashCard)

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

const handleBuyCardClick = () => {
  buyCard(playerCardDeck)
}

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

renderDeckIntoDOM(playerCardDeck)
renderDeckIntoDOM(botCardDeck)


playerDOMcards.forEach(card => card.addEventListener('mouseover', handleCardHover))
playerDOMcards.forEach(card => card.addEventListener('click', handleCardClick))
$buyCard.addEventListener('click', handleBuyCardClick)