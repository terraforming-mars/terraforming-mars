import {expect} from 'chai';
import {IapetusII} from '../../../src/server/cards/pathfinders/IapetusII';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {EconomicEspionage} from '../../../src/server/cards/pathfinders/EconomicEspionage';
import {AddResourcesToCard} from '../../../src/server/deferredActions/AddResourcesToCard';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('IapetusII', function() {
  let iapetusII: IapetusII;
  let lunarObservationPost: LunarObservationPost;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(function() {
    iapetusII = new IapetusII();
    lunarObservationPost = new LunarObservationPost();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies = [iapetusII];
  });

  it('Should activate', function() {
    expect(iapetusII.isActive).is.false;
    player.titanium = 1; // for Lunar Observation Post costs.
    player.playCard(lunarObservationPost); // playCard activates any colonies.
    expect(iapetusII.isActive).is.true;
  });

  it('Should build', function() {
    player.playedCards = [lunarObservationPost];
    iapetusII.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.pop()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Lunar Observation Post, since there's no other target
    action.execute();

    expect(lunarObservationPost.resourceCount).to.eq(3);
  });

  it('Should trade', function() {
    player.playedCards = [lunarObservationPost];
    iapetusII.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = game.deferredActions.pop()!; // AddResourcesToCard
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Lunar Observation Post, since there's no other target
    action.execute();

    expect(lunarObservationPost.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', function() {
    const economicEspionage = new EconomicEspionage();
    player.playedCards = [lunarObservationPost];
    player2.playedCards = [economicEspionage];

    iapetusII.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement data

    iapetusII.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(lunarObservationPost.resourceCount).to.eq(4);
    expect(economicEspionage.resourceCount).to.eq(1);
  });
});
