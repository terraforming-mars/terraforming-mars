import {expect} from 'chai';
import {NuclearPower} from '../../../src/cards/base/NuclearPower';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';

describe('NuclearPower', function() {
  let card: NuclearPower;
  let player: Player;

  beforeEach(function() {
    card = new NuclearPower();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    player.addProduction(Resources.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(-2);
    expect(player.getProduction(Resources.ENERGY)).to.eq(3);
  });
});
