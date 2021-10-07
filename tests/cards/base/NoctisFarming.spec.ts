import {expect} from 'chai';
import {NoctisFarming} from '../../../src/cards/base/NoctisFarming';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('NoctisFarming', function() {
  let card : NoctisFarming; let player : TestPlayer; let game : Game;

  beforeEach(function() {
    card = new NoctisFarming();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = -20;
    expect(card.canPlay(player)).is.true;

    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.plants).to.eq(2);

    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
