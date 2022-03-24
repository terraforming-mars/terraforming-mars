import {Game} from '../../../src/Game';
import {MarsDirect} from '../../../src/cards/pathfinders/MarsDirect';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {PowerPlant} from '../../../src/cards/pathfinders/PowerPlant';
import {ControlledBloom} from '../../../src/cards/pathfinders/ControlledBloom';
import {TestingUtils} from '../../TestingUtils';
import {PATHFINDERS_CARD_MANIFEST} from '../../../src/cards/pathfinders/PathfindersCardManifest';
import {Tags} from '../../../src/common/cards/Tags';

describe('MarsDirect', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: MarsDirect;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    Game.newInstance('id', [player, player2], player);
    card = new MarsDirect();
  });

  it('effect', () => {
    // Cost 13, has a mars tag
    const powerPlant = new PowerPlant();
    // Cost 13, has no mars tag.
    const controlledBloom = new ControlledBloom();

    // Controlled Bloom requires 3 oceans. Let player2 place them so player can't gain bonus.
    TestingUtils.addOcean(player2);
    TestingUtils.addOcean(player2);
    TestingUtils.addOcean(player2);

    player.cardsInHand = [powerPlant, controlledBloom];
    player.corporationCard = card;

    player.tagsForTest = {mars: 0};
    player.megaCredits = 13;
    expect(player.getPlayableCards()).has.members([powerPlant, controlledBloom]);

    player.tagsForTest = {mars: 0};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {mars: 1};
    player.megaCredits = 12;
    expect(player.getPlayableCards()).has.members([powerPlant]);

    player.tagsForTest = {mars: 1};
    player.megaCredits = 11;
    expect(player.getPlayableCards()).is.empty;

    player.tagsForTest = {mars: 2};
    player.megaCredits = 11;
    expect(player.getPlayableCards()).has.members([powerPlant]);
  });

  it('verify buff is lined up with game state', () => {
    let count = 0;
    PATHFINDERS_CARD_MANIFEST.projectCards.factories.forEach((factory) => {
      if (new factory.Factory().tags.includes(Tags.MARS)) {
        count++;
      }
    });
    // When this fails, reduce starting MC by 1.5MC per fail.
    expect(count).eq(32);
  });
});

