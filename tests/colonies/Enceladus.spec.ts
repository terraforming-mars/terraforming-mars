import {expect} from 'chai';
import {RegolithEaters} from '../../src/server/cards/base/RegolithEaters';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {Enceladus} from '../../src/server/colonies/Enceladus';
import {AddResourcesToCard} from '../../src/server/deferredActions/AddResourcesToCard';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';

describe('Enceladus', function() {
  let enceladus: Enceladus;
  let tardigrades: Tardigrades;
  let player: Player;
  let player2: Player;
  let game: Game;

  beforeEach(function() {
    enceladus = new Enceladus();
    tardigrades = new Tardigrades();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(enceladus);
  });

  it('Should activate', function() {
    expect(enceladus.isActive).is.false;
    player.playCard(tardigrades);
    expect(enceladus.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(tardigrades);
    enceladus.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Tardigrades, since there's no other target
    action.execute();

    expect(tardigrades.resourceCount).to.eq(3);
  });

  it('Should trade', function() {
    player.playCard(tardigrades);
    enceladus.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Tardigrades, since there's no other target
    action.execute();

    expect(tardigrades.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', function() {
    const regolithEaters = new RegolithEaters();
    player.playCard(tardigrades);
    player2.playCard(regolithEaters);

    enceladus.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement microbes

    enceladus.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(tardigrades.resourceCount).to.eq(4);
    expect(regolithEaters.resourceCount).to.eq(1);
  });
});
