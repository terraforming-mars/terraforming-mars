import {expect} from 'chai';
import {AerialMappers} from '../../src/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../src/cards/venusNext/Dirigibles';
import {Titan} from '../../src/colonies/Titan';
import {AddResourcesToCard} from '../../src/deferredActions/AddResourcesToCard';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {TestPlayers} from '../TestPlayers';
import {TestingUtils} from '../TestingUtils';

describe('Titan', function() {
  let titan: Titan; let aerialMappers: AerialMappers; let player: Player; let player2: Player; let game: Game;

  beforeEach(function() {
    titan = new Titan();
    aerialMappers = new AerialMappers();
    player = TestPlayers.BLUE.newPlayer();
    player2 = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, player2], player);
    game.gameOptions.coloniesExtension = true;
    game.colonies.push(titan);
  });

  it('Should activate', function() {
    expect(titan.isActive).is.false;
    player.playCard(aerialMappers);
    expect(titan.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(aerialMappers);
    titan.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.pop()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(3);
  });

  it('Should trade', function() {
    player.playCard(aerialMappers);
    titan.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = game.deferredActions.pop()!; // AddResourcesToCard
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', function() {
    const dirigibles = new Dirigibles();
    player.playCard(aerialMappers);
    player2.playCard(dirigibles);

    titan.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement floaters

    titan.trade(player2);
    TestingUtils.runAllActions(game); // Gain Trade & Bonus

    expect(aerialMappers.resourceCount).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(1);
  });
});
