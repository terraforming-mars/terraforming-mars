import {expect} from 'chai';
import {SpaceElevator} from '../../../src/cards/base/SpaceElevator';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('SpaceElevator', function() {
  let card : SpaceElevator; let player : Player; let game : Game;

  beforeEach(function() {
    card = new SpaceElevator();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t act if no steel', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player, game);
    expect(player.getProduction(Resources.TITANIUM)).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(2);
  });

  it('Should act', function() {
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    card.action(player, game);
    expect(player.steel).to.eq(0);
    expect(player.megaCredits).to.eq(5);
  });
});
