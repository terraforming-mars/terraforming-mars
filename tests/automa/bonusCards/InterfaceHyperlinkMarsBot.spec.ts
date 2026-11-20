import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {Tag} from '@/common/cards/Tag';
import {InterfaceHyperlinkMarsBot} from '@/server/automa/bonusCards/InterfaceHyperlinkMarsBot';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {SearchForLife} from '@/server/cards/base/SearchForLife';
import {cardsFromJSON} from '@/server/createCard';
import {fakeCard} from '../../TestingUtils';
import {TRACK, recordingMarsBot} from '../corps/RecordingMarsBot';

/** A bot with its energy track at `energy` and `topCards` on top of the project deck, the first one on top. */
function hyperlinkBot(energy: number, topCards: ReadonlyArray<IProjectCard>) {
  const played: Array<IProjectCard> = [];
  const {marsBot} = recordingMarsBot({resolveProjectCard: (card) => played.push(card)});
  marsBot.marsBotBoard.tracks[TRACK.power].position = energy;
  // The top of the project deck is the end of the draw pile
  marsBot.game.projectDeck.drawPile.push(...topCards.toReversed());
  return {marsBot, played};
}

describe('InterfaceHyperlinkMarsBot', () => {
  for (const run of [
    {
      energy: 4,
      deck: [CardName.TARDIGRADES, CardName.ASTEROID, CardName.GIANT_ICE_ASTEROID, CardName.SEARCH_FOR_LIFE],
      expected: {
        played: [CardName.SEARCH_FOR_LIFE, CardName.GIANT_ICE_ASTEROID],
        discarded: [CardName.ASTEROID, CardName.TARDIGRADES],
      },
    },
    // Mine and Power Plant both cost 4 M€
    {
      energy: 3,
      deck: [CardName.MINE, CardName.POWER_PLANT, CardName.SEARCH_FOR_LIFE],
      expected: {
        played: [CardName.SEARCH_FOR_LIFE, CardName.POWER_PLANT],
        discarded: [CardName.MINE],
      },
    },
    {
      energy: 0,
      deck: [CardName.MINE, CardName.POWER_PLANT, CardName.SEARCH_FOR_LIFE],
      expected: {
        played: [CardName.POWER_PLANT, CardName.MINE],
        discarded: [],
      },
    },
  ] as const) {
    it('draws 1 card per energy space, at least 2, and plays science, then the most expensive, then the most tags: ' + JSON.stringify(run), () => {
      const {marsBot, played} = hyperlinkBot(run.energy, cardsFromJSON(run.deck));
      const discardPile = marsBot.game.projectDeck.discardPile;
      const discardsBefore = discardPile.length;

      const destroyed = new InterfaceHyperlinkMarsBot().resolve(marsBot);

      expect(played.map((card) => card.name)).deep.eq(run.expected.played);
      expect(discardPile.slice(discardsBefore).map((card) => card.name)).deep.eq(run.expected.discarded);
      expect(destroyed).is.true;
    });
  }

  // A wild tag counts as a tag (Nick, Q&A 19)
  it('counts wild tags in the tag tiebreak', () => {
    const building = fakeCard({cost: 4, tags: [Tag.BUILDING]});
    const twoWild = fakeCard({cost: 4, tags: [Tag.WILD, Tag.WILD]});
    const searchForLife = new SearchForLife();
    const {marsBot, played} = hyperlinkBot(3, [building, twoWild, searchForLife]);

    new InterfaceHyperlinkMarsBot().resolve(marsBot);

    expect(played).deep.eq([searchForLife, twoWild]);
  });

  it('is kept when the project deck is empty', () => {
    const {marsBot, played} = hyperlinkBot(4, []);
    marsBot.game.projectDeck.drawPile.length = 0;
    marsBot.game.projectDeck.discardPile.length = 0;

    const destroyed = new InterfaceHyperlinkMarsBot().resolve(marsBot);

    expect(played).is.empty;
    expect(destroyed).is.false;
  });
});
