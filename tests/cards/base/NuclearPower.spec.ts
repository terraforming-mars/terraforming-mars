import {expect} from 'chai';
import {NuclearPower} from '../../../src/server/cards/base/NuclearPower';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
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
    player.production.add(Resources.MEGACREDITS, -4);
    expect(player.simpleCanPlay(card)).is.not.true;
  });

  it('Should play', function() {
    expect(player.simpleCanPlay(card)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
    expect(player.production.energy).to.eq(3);
  });
});
