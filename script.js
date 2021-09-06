const amountOfCardsInDeck = 4
const colorsOfCards = ['blue', 'red', 'green', 'yellow']
const playersDecks = {}

const createCardDeck = deckName => {
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

  playersDecks[deckName] = newDeck
}
 
const renderDeckIntoDOM = deck => {
  const isPlayerDeck = deck == 'player'

  const deckContainer = document.querySelector(`.${isPlayerDeck
    ? 'player-deck'
    : 'bot-deck'}`)

  const deckToHTML = deck.map(({ cardNumber, cardColor }) => {
    return `
      <div class="card ${isPlayerDeck ? cardColor : 'hidden'}">
        <span>${isPlayerDeck ? cardNumber : ''}</span>
      </div>
    `
  }).join('')

  deckContainer.innerHTML += deckToHTML
}

const equalCardsInDeck = (deck, number, color) => {
  const equalsCards = deck.filter(({ cardNumber, cardColor }) => {
    return cardNumber == number || cardColor == color
  })

  return equalsCards
}

const throwCard = (deck, number, color) => {
  const equalsCards = equalCardsInDeck(deck, number, color)

  const equalsCardsIncludesThrowingCard = equalsCards
  .some((({ cardNumber, cardColor }) =>
      cardNumber == number && cardColor == color))

  const throwingCardIndex = deck.findIndex(({ cardNumber, cardColor }) =>
    cardNumber == number && cardColor == color)

  if (equalsCardsIncludesThrowingCard) {
    deck.splice(throwingCardIndex, 1)

    renderDeckIntoDOM(deck)
  }

  console.log('Oops, essa carta não combina')
}

const playerCardDeck = createCardDeck('player')
const botCardDeck = createCardDeck('bot')

// renderDeckIntoDOM(playerCardDeck)
// renderDeckIntoDOM(botCardDeck)