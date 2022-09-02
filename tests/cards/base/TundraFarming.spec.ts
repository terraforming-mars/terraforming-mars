import {expect} from 'chai';
import {TundraFarming} from '../../../src/server/cards/base/TundraFarming';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('TundraFarming', function() {
  let card: TundraFarming;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new TundraFarming();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -6;
    expect(player.canPlayIgnoringCost(card)).is.true;

    card.play(player);
    expect(player.production.plants).to.eq(1);
    expect(player.production.megacredits).to.eq(2);
    expect(player.plants).to.eq(1);

    expect(card.getVictoryPoints()).to.eq(2);
  });
});
