import {expect} from 'chai';
import {Titan} from '../../src/colonies/Titan';
import {AerialMappers} from '../../src/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../src/cards/venusNext/Dirigibles';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {AddResourcesToCard} from '../../src/deferredActions/AddResourcesToCard';

describe('Titan', function() {
  let titan: Titan; let aerialMappers: AerialMappers; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    titan = new Titan();
    aerialMappers = new AerialMappers();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);
    game = new Game('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(titan);
  });

  it('Should activate', function() {
    expect(titan.isActive).is.false;
    player.playCard(game, aerialMappers);
    expect(titan.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(game, aerialMappers);
    titan.addColony(player, game);

    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.shift()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(3);
  });

  it('Should trade', function() {
    player.playCard(game, aerialMappers);
    titan.trade(player, game);

    // Should have AddResourcesToCard, GiveColonyBonus and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    const action = game.deferredActions.shift()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', function() {
    const dirigibles = new Dirigibles();
    player.playCard(game, aerialMappers);
    player2.playCard(game, dirigibles);

    titan.addColony(player, game);
    game.deferredActions.shift()!.execute(); // Gain placement floaters

    titan.trade(player2, game);
    game.deferredActions.shift()!.execute(); // Gain trade floaters

    game.deferredActions.runAll(() => {}); // Trade bonus

    expect(aerialMappers.resourceCount).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(1);
  });
});
