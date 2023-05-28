const { CardType, CardName, Player, FakeMediaConference } = require('build\src\server\cards\nuclear\FakeMediaConference.js');

const player = new Player();
player.lastCardPlayed = CardName.FAKE_MEDIA_CONFERENCE;

const card = {
  type: CardType.STANDARD_PROJECT,
  // ... inne właściwości karty
};

const fakeMediaConference = new FakeMediaConference();

console.log("lastCardPlayed:", player.lastCardPlayed);
console.log("this.name:", fakeMediaConference.name);
console.log("card.type:", card.type);
console.log("matchingType:", fakeMediaConference.matchingType(card.type));