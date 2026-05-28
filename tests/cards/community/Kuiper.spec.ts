import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {RotatorImpacts} from '../../../src/server/cards/venusNext/RotatorImpacts';
import {Kuiper} from '../../../src/server/cards/community/Kuiper';
import {AddResourcesToCard} from '../../../src/server/deferredActions/AddResourcesToCard';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Kuiper', () => {
  let kuiper: Kuiper;
  let cometAiming: CometAiming;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    kuiper = new Kuiper();
    cometAiming = new CometAiming();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(kuiper);
  });

  it('Should activate', () => {
    expect(kuiper.isActive).is.false;
    player.playCard(cometAiming);
    expect(kuiper.isActive).is.true;
  });

  it('Should build', () => {
    player.playCard(cometAiming);
    kuiper.addColony(player);

    expect(game.deferredActions).has.lengthOf(1);
    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to CometAiming, since there's no other target.
    action.execute();

    expect(cometAiming.resourceCount).to.eq(2);
  });

  it('Should trade', () => {
    player.playCard(cometAiming);
    kuiper.trade(player);

    // Should have GiveColonyBonus, AddResourcesToCard and decrease track.
    expect(game.deferredActions).has.lengthOf(3);
    game.deferredActions.pop(); // GiveColonyBonus

    const action = cast(game.deferredActions.pop(), AddResourcesToCard);
    expect(action.player).to.eq(player);
    // Should directly add to CometAiming, since there's no other target.
    action.execute();

    expect(cometAiming.resourceCount).to.eq(1);
  });

  it('Should give trade bonus', () => {
    const rotatorImpacts = new RotatorImpacts();
    player.playCard(cometAiming);
    player2.playCard(rotatorImpacts);
    player2.megaCredits = 0;

    kuiper.addColony(player);
    game.deferredActions.pop()!.execute(); // Gain placement asteroids.

    kuiper.trade(player2);
    runAllActions(game); // Gain Trade & Bonus

    expect(cometAiming.resourceCount).to.eq(2);
    expect(rotatorImpacts.resourceCount).to.eq(1);
    // Colony owner (player) gets 3 M€ from the colony bonus.
    expect(player2.megaCredits).to.eq(0);
  });
});
