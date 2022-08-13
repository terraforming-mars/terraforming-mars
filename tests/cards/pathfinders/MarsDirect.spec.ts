import {Game} from '../../../src/server/Game';
import {MarsDirect} from '../../../src/server/cards/pathfinders/MarsDirect';
import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {PowerPlant} from '../../../src/server/cards/pathfinders/PowerPlant';
import {ControlledBloom} from '../../../src/server/cards/pathfinders/ControlledBloom';
import {addOcean} from '../../TestingUtils';

describe('MarsDirect', () => {
  let player: TestPlayer;
  let player2: TestPlayer;
  let card: MarsDirect;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, player2], player);
    card = new MarsDirect();
  });

  it('effect', () => {
    // Cost 13, has a mars tag
    const powerPlant = new PowerPlant();
    // Cost 13, has no mars tag.
    const controlledBloom = new ControlledBloom();

    // Controlled Bloom requires 3 oceans. Let player2 place them so player can't gain bonus.
    addOcean(player2);
    addOcean(player2);
    addOcean(player2);

    player.cardsInHand = [powerPlant, controlledBloom];
    player.setCorporationForTest(card);

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
});

