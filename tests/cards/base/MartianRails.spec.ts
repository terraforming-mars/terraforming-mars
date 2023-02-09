import {expect} from 'chai';
import {addCityTile} from '../../TestingUtils';
import {MartianRails} from '../../../src/server/cards/base/MartianRails';
import {Game} from '../../../src/server/Game';
import {SpaceName} from '../../../src/server/SpaceName';
import {TestPlayer} from '../../TestPlayer';

describe('MartianRails', () => {
  let card: MartianRails;
  let player: TestPlayer;

  beforeEach(() => {
    card = new MartianRails();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act without energy', () => {
    expect(card.play(player)).is.undefined;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    addCityTile(player);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ignores cities off Mars', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.true;
    addCityTile(player, SpaceName.GANYMEDE_COLONY);

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.megaCredits).to.eq(0);
  });
});
