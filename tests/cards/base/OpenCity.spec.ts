import {expect} from 'chai';
import {OpenCity} from '../../../src/server/cards/base/OpenCity';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {Resources} from '../../../src/common/Resources';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';

describe('OpenCity', function() {
  let card: OpenCity;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new OpenCity();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Can not play without energy production', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if oxygen level too low', function() {
    player.production.add(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 11;
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    player.production.add(Resources.ENERGY, 1);
    (game as any).oxygenLevel = 12;
    expect(card.canPlay(player)).is.true;

    expect(card.play(player)).is.undefined;
    runAllActions(player.game);
    const action = cast(player.popWaitingFor(), SelectSpace);

    action.cb(action.availableSpaces[0]);
    expect(game.getCitiesOnMarsCount()).to.eq(1);

    expect(player.production.energy).to.eq(0);
    expect(player.production.megacredits).to.eq(4);
    expect(player.plants).to.eq(2);

    expect(card.getVictoryPoints()).to.eq(1);
  });
});
