import {expect} from 'chai';
import {AerialMappers} from '../../src/server/cards/venusNext/AerialMappers';
import {Dirigibles} from '../../src/server/cards/venusNext/Dirigibles';
import {Titan} from '../../src/server/colonies/Titan';
import {AddResourcesToCard} from '../../src/server/deferredActions/AddResourcesToCard';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Titan', () => {
  let titan: Titan;
  let aerialMappers: AerialMappers;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    titan = new Titan();
    aerialMappers = new AerialMappers();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(titan);
  });

  it('Should activate', () => {
    expect(titan.isActive).is.false;
    player.playCard(aerialMappers);
    expect(titan.isActive).is.true;
  });

  it('Should build', () => {
    player.playCard(aerialMappers);
    titan.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(3);
  });

  it('Should trade', () => {
    player.playCard(aerialMappers);
    titan.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to AerialMappers, since there's no other target
    action.execute();

    expect(aerialMappers.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', () => {
    const dirigibles = new Dirigibles();
    player.playCard(aerialMappers);
    player2.playCard(dirigibles);

    titan.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement floaters

    titan.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(aerialMappers.resourceCount).to.eq(4);
    expect(dirigibles.resourceCount).to.eq(1);
  });
});
