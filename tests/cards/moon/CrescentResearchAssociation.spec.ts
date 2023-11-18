import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {setOxygenLevel} from '../../TestingUtils';
import {CrescentResearchAssociation} from '../../../src/server/cards/moon/CrescentResearchAssociation';
import {TestPlayer} from '../../TestPlayer';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {Predators} from '../../../src/server/cards/base/Predators';

describe('CrescentResearchAssociation', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: CrescentResearchAssociation;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    card = new CrescentResearchAssociation();
  });

  it('effect', () => {
    // Cost 14, has a moon tag
    const mareNectarisMine = new MareNectarisMine();
    // Cost 14, has no moon tag.
    const predators = new Predators();

    // Additional card requirements.
    player.titanium = 1;
    setOxygenLevel(game, 14);

    player.cardsInHand = [mareNectarisMine, predators];
    player.setCorporationForTest(card);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 14;
    expect(player.getPlayableCardsForTest()).has.members([mareNectarisMine, predators]);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 13;
    expect(player.getPlayableCardsForTest()).is.empty;

    player.tagsForTest = {moon: 1};
    player.megaCredits = 13;
    expect(player.getPlayableCardsForTest()).has.members([mareNectarisMine]);

    player.tagsForTest = {moon: 1};
    player.megaCredits = 12;
    expect(player.getPlayableCardsForTest()).is.empty;

    player.tagsForTest = {moon: 2};
    player.megaCredits = 12;
    expect(player.getPlayableCardsForTest()).has.members([mareNectarisMine]);
  });

  it('getVictoryPoints', () => {
    player.playedCards.push(card);
    player.tagsForTest = {moon: 0};
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {moon: 1};
    expect(card.getVictoryPoints(player)).eq(0);
    player.tagsForTest = {moon: 2};
    expect(card.getVictoryPoints(player)).eq(0);

    player.tagsForTest = {moon: 3};
    expect(card.getVictoryPoints(player)).eq(1);
    player.tagsForTest = {moon: 4};
    expect(card.getVictoryPoints(player)).eq(1);
    player.tagsForTest = {moon: 5};
    expect(card.getVictoryPoints(player)).eq(1);

    player.tagsForTest = {moon: 6};
    expect(card.getVictoryPoints(player)).eq(2);
    player.tagsForTest = {moon: 7};
    expect(card.getVictoryPoints(player)).eq(2);
    player.tagsForTest = {moon: 8};
    expect(card.getVictoryPoints(player)).eq(2);
  });
});

