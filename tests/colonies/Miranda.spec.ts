import {expect} from 'chai';
import {Pets} from '../../src/server/cards/base/Pets';
import {Predators} from '../../src/server/cards/base/Predators';
import {Miranda} from '../../src/server/colonies/Miranda';
import {AddResourcesToCard} from '../../src/server/deferredActions/AddResourcesToCard';
import {IGame} from '../../src/server/IGame';
import {TestPlayer} from '../TestPlayer';
import {cast, runAllActions} from '../TestingUtils';
import {testGame} from '../TestGame';

describe('Miranda', function() {
  let miranda: Miranda;
  let pets: Pets;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    miranda = new Miranda();
    pets = new Pets();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(miranda);
  });

  it('Should activate', function() {
    expect(miranda.isActive).is.false;
    player.playCard(pets);
    expect(miranda.isActive).is.true;
  });

  it('Should build', function() {
    player.playCard(pets);
    runAllActions(game);
    expect(pets.resourceCount).to.eq(1); // Pets starts with 1 resource
    miranda.addColony(player);
    runAllActions(game);
    // Should directly add to Pets, since there's no other target
    expect(pets.resourceCount).to.eq(2);
  });

  it('Should trade', function() {
    player.playCard(pets);
    runAllActions(game);
    miranda.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Pets, since there's no other target
    action.execute();

    expect(pets.resourceCount).to.eq(2);
  });

  it('Should give trade bonus', function() {
    const predators = new Predators();
    player.playCard(pets);
    player2.playCard(predators);
    runAllActions(game);

    miranda.addColony(player);
    runAllActions(game);

    miranda.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(pets.resourceCount).to.eq(2);
    expect(predators.resourceCount).to.eq(1);
    expect(player.cardsInHand).has.lengthOf(1);
  });
});
