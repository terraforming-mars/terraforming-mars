import {expect} from 'chai';
import {DesignedMicroOrganisms} from '../../../src/server/cards/base/DesignedMicroOrganisms';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {TestPlayer} from '../../TestPlayer';

describe('DesignedMicroOrganisms', function() {
  let card: DesignedMicroOrganisms;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new DesignedMicroOrganisms();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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
    expect(player.production.plants).to.eq(2);
  });
});
