import {expect} from 'chai';
import {IapetusII} from '../../../src/server/cards/pathfinders/IapetusII';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {EconomicEspionage} from '../../../src/server/cards/pathfinders/EconomicEspionage';
import {AddResourcesToCard} from '../../../src/server/deferredActions/AddResourcesToCard';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';

describe('IapetusII', () => {
  let iapetusII: IapetusII;
  let lunarObservationPost: LunarObservationPost;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    iapetusII = new IapetusII();
    lunarObservationPost = new LunarObservationPost();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies = [iapetusII];
  });

  it('Should activate', () => {
    expect(iapetusII.isActive).is.false;
    player.titanium = 1; // for Lunar Observation Post costs.
    player.playCard(lunarObservationPost); // playCard activates any colonies.
    expect(iapetusII.isActive).is.true;
  });

  it('Should build', () => {
    player.playedCards.push(lunarObservationPost);
    iapetusII.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.pop()!;
    expect(action).to.be.an.instanceof(AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to Lunar Observation Post, since there's no other target
    action.execute();

    expect(lunarObservationPost.resourceCount).to.eq(3);
  });

  it('Should trade', () => {
    player.playedCards.push(lunarObservationPost);
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

  it('Should give trade bonus', () => {
    const economicEspionage = new EconomicEspionage();
    player.playedCards.push(lunarObservationPost);
    player2.playedCards.push(economicEspionage);

    iapetusII.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement data

    iapetusII.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(lunarObservationPost.resourceCount).to.eq(4);
    expect(economicEspionage.resourceCount).to.eq(1);
  });
});
