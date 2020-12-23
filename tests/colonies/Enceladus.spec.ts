import {expect} from 'chai';
import {RegolithEaters} from '../../src/cards/base/RegolithEaters';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {Enceladus} from '../../src/colonies/Enceladus';
import {AddResourcesToCard} from '../../src/deferredActions/AddResourcesToCard';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {TestPlayers} from '../TestingUtils';

describe('Enceladus', function() {
  let enceladus: Enceladus; let tardigrades: Tardigrades; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    enceladus = new Enceladus();
    tardigrades = new Tardigrades();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(enceladus);
  });

  it('Should activate', function() {
    expect(enceladus.isActive).is.false;
    player.playCard(game, tardigrades);
    expect(enceladus.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(game, tardigrades);
    enceladus.addColony(player, game);

    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.shift()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Tardigrades, since there's no other target
    action.execute();

    expect(tardigrades.resourceCount).to.eq(3);
  });

  it('Should trade', function() {
    player.playCard(game, tardigrades);
    enceladus.trade(player, game);

    // Should have AddResourcesToCard, GiveColontBonus and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    const action = game.deferredActions.shift()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Tardigrades, since there's no other target
    action.execute();

    expect(tardigrades.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', function() {
    const regolithEaters = new RegolithEaters();
    player.playCard(game, tardigrades);
    player2.playCard(game, regolithEaters);

    enceladus.addColony(player, game);
    game.deferredActions.shift()!.execute(); // Gain placement microbes

    enceladus.trade(player2, game);
    game.deferredActions.shift()!.execute(); // Gain trade microbes

    game.deferredActions.runAll(() => {}); // Trade bonus

    expect(tardigrades.resourceCount).to.eq(4);
    expect(regolithEaters.resourceCount).to.eq(1);
  });
});
