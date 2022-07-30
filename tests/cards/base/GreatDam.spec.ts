import {expect} from 'chai';
import {GreatDam} from '../../../src/cards/base/GreatDam';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {maxOutOceans} from '../../TestingUtils';

describe('GreatDam', () => {
  let card: GreatDam;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GreatDam();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can play', () => {
    maxOutOceans(player, 3);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', () => {
    maxOutOceans(player, 4);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).to.eq(2);
    expect(card.getVictoryPoints()).to.eq(1);
  });
});
