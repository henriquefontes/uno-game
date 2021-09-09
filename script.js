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
  playerDOMcards.forEach(card => card.addEventListener('mouseover', handleHoverCard))
  playerDOMcards.forEach(card => card.addEventListener('click', handleClickCard))
}

const cardsEqualsLastTrashCard = (deck, number, color) => {
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

  const equalsCards = cardsEqualsLastTrashCard(
    playerDeck, numberOfLastTrashCard, colorOfLastTrashCard
  )

  const equalsCardsIncludesThrowingCard = cardsEqualsLastTrashCard
  .some((({ cardNumber, cardColor }) =>
      cardNumber == throwingCardNumber && cardColor == throwingCardColor))

  const throwingCardIndex = playerDeck.findIndex(({ cardNumber, cardColor }) =>
    cardNumber == throwingCardNumber && cardColor == throwingCardColor)

  if (equalsCardsIncludesThrowingCard) {
    playerDeck.splice(throwingCardIndex, 1)

    renderDeckIntoDOM(playerName)
    
    return
  }

  return
}

const handleHoverCard = event => {
  const cardContainer = event.target
  const classesOfHoveredCard = cardContainer.getAttribute('data-js').split('-')
  const [ numberOfHoveredCard, colorOfHoveredCard ] = classesOfHoveredCard

  const lastTrashCard = trashDOMcards[trashDOMcards.length - 1]
  const classesOfLastTrashCard = lastTrashCard.getAttribute('data-trash').split('-')
  const [ numberOfLastTrashCard, colorOfLastTrashCard ] = classesOfLastTrashCard

  const hoveredCardEqualsLastTrashCard = cardsEqualsLastTrashCard(
    playersDecks[playerCardDeck], numberOfLastTrashCard, colorOfLastTrashCard
  ).some((({ cardNumber, cardColor }) =>
  cardNumber == numberOfHoveredCard && cardColor == colorOfHoveredCard))

  const styleCursor = hoveredCardEqualsLastTrashCard
    ? cardContainer.style.cursor = "pointer"
    : cardContainer.style.cursor = "not-allowed"
}

const handleClickCard = event => {
  const classesOfClickedCard = event.target.getAttribute('data-js').split('-')

  const [ numberOfClickedCard, colorOfClickedCard ] = classesOfClickedCard

  console.log(numberOfClickedCard, colorOfClickedCard)

  throwCard('player', numberOfClickedCard, colorOfClickedCard)
}

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

renderDeckIntoDOM(playerCardDeck)
renderDeckIntoDOM(botCardDeck)

playerDOMcards.forEach(card => card.addEventListener('mouseover', handleHoverCard))
playerDOMcards.forEach(card => card.addEventListener('click', handleClickCard))