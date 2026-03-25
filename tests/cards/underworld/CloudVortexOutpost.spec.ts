import {expect} from 'chai';
import {CloudVortexOutpost} from '../../../src/server/cards/underworld/CloudVortexOutpost';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Dirigibles} from '../../../src/server/cards/venusNext/Dirigibles';

describe('CloudVortexOutpost', () => {
  it('play', () => {
    const card = new CloudVortexOutpost();
    const [game, player] = testGame(1, {venusNextExtension: true, underworldExpansion: true});

    expect(player.terraformRating).eq(14);
    expect(game.getVenusScaleLevel()).eq(0);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(game.getVenusScaleLevel()).eq(4);
    expect(player.terraformRating).eq(16);
    expect(card.resourceCount).eq(3);
  });

  it('Can not move floater if it is empty', () => {
    const card = new CloudVortexOutpost();
    const floaterHost = new Dirigibles();
    const [/* game */, player] = testGame(1, {venusNextExtension: true, underworldExpansion: true});
    card.play(player);
    player.playCard(floaterHost);
    card.resourceCount = 0;
    expect(card.canAct(player)).is.false;
  });

  it('Can not move floater if there is no other floater card', () => {
    const card = new CloudVortexOutpost();
    const [/* game */, player] = testGame(1, {venusNextExtension: true, underworldExpansion: true});
    card.play(player);
    expect(card.canAct(player)).is.false;
  });

  it('Move floater', () => {
    const card = new CloudVortexOutpost();
    const [game, player] = testGame(1, {venusNextExtension: true, underworldExpansion: true});
    const floaterHost = new Dirigibles();

    player.playedCards.push(floaterHost);

    card.resourceCount = 2;

    expect(card.canAct(player)).is.true;
    expect(floaterHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(player);

    game.deferredActions.peek()!.execute();

    expect(card.resourceCount).eq(1);
    expect(floaterHost.resourceCount).eq(1);
  });
});
