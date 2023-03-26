import {expect} from 'chai';
import {setTemperature} from '../../TestingUtils';
import {DesignedMicroOrganisms} from '../../../src/server/cards/base/DesignedMicroOrganisms';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('DesignedMicroOrganisms', function() {
  let card: DesignedMicroOrganisms;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new DesignedMicroOrganisms();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Cannot play', function() {
    setTemperature(game, -12);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Can play', function() {
    setTemperature(game, -14);
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Should play', function() {
    setTemperature(game, -14);
    expect(player.canPlayIgnoringCost(card)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(2);
  });
});
