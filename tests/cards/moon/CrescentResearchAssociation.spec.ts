import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {CrescentResearchAssociation} from '../../../src/cards/moon/CrescentResearchAssociation';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {MareNectarisMine} from '../../../src/cards/moon/MareNectarisMine';
import {Predators} from '../../../src/cards/base/Predators';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('CrescentResearchAssociation', () => {
  let player: TestPlayer;
  let game: Game;
  let card: CrescentResearchAssociation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    player.corporationCard = card;

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

