import {expect} from 'chai';
import {Manutech} from '../../../src/cards/venusNext/Manutech';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('Manutech', function() {
  let card : Manutech; let player : Player; let game : Game;

  beforeEach(function() {
    card = new Manutech();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
    player.corporationCard = card;
  });

  it('Should play', function() {
    card.play(player);
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.steel).to.eq(1);
  });

  it('Should add energy resources by Power Plant standard project', function() {
    const action = (player as any).buildPowerPlant(game);
    expect(action).is.not.undefined;
    action.cb();
        game.deferredActions.shift()!.execute();
        expect(player.getResource(Resources.ENERGY)).to.eq(1);
  });
});
