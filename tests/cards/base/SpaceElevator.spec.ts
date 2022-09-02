import {expect} from 'chai';
import {SpaceElevator} from '../../../src/server/cards/base/SpaceElevator';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';

describe('SpaceElevator', function() {
  let card: SpaceElevator;
  let player: TestPlayer;

  beforeEach(function() {
    card = new SpaceElevator();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not act if no steel', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.production.titanium).to.eq(1);
    expect(card.getVictoryPoints()).to.eq(2);
  });

  it('Should act', function() {
    player.steel = 1;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.steel).to.eq(0);
    expect(player.megaCredits).to.eq(5);
  });
});
