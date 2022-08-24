import {expect} from 'chai';
import {NoctisFarming} from '../../../src/server/cards/base/NoctisFarming';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('NoctisFarming', function() {
  let card: NoctisFarming;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new NoctisFarming();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -20;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.production.megacredits).to.eq(1);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
