import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {CrescentResearchAssociation} from '../../../src/server/cards/moon/CrescentResearchAssociation';
import {TestPlayer} from '../../TestPlayer';
import {MareNectarisMine} from '../../../src/server/cards/moon/MareNectarisMine';
import {Predators} from '../../../src/server/cards/base/Predators';

describe('CrescentResearchAssociation', () => {
  let player: TestPlayer;
  let game: Game;
  let card: CrescentResearchAssociation;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new CrescentResearchAssociation();
  });

  it('effect', () => {
    // Cost 14, has a moon tag
    const mareNectarisMine = new MareNectarisMine();
    // Cost 14, has no moon tag.
    const predators = new Predators();

    // Additional card requirements.
    player.titanium = 1;
    (game as any).oxygenLevel = 14;

    player.cardsInHand = [mareNectarisMine, predators];
    player.setCorporationForTest(card);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 14;
    expect(player.getPlayableCards()).has.members([mareNectarisMine, predators]);

    player.tagsForTest = {moon: 0};
    player.megaCredits = 13;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {moon: 1};
    player.megaCredits = 13;
    expect(player.getPlayableCards()).has.members([mareNectarisMine]);

    player.tagsForTest = {moon: 1};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {moon: 2};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).has.members([mareNectarisMine]);
  });

  it('getVictoryPoints', () => {
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

