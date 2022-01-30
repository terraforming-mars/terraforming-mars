import {expect} from 'chai';
import {DesignedMicroOrganisms} from '../../../src/cards/base/DesignedMicroOrganisms';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('DesignedMicroOrganisms', function() {
  let card : DesignedMicroOrganisms; let player : Player; let game : Game;

  beforeEach(function() {
    card = new DesignedMicroOrganisms();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    (game as any).temperature = -12;
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', function() {
    (game as any).temperature = -14;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', function() {
    (game as any).temperature = -14;
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(player.getProduction(Resources.PLANTS)).to.eq(2);
  });
});
