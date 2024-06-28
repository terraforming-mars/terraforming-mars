import {expect} from 'chai';
import {DemetronLabs} from '../../../src/server/cards/underworld/DemetronLabs';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {IPlayer} from '../../../src/server/IPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';

describe('DemetronLabs', () => {
  it('play', () => {
    const card = new DemetronLabs();
    const [game, player] = testGame(2, {underworldExpansion: true});
    card.play(player);
    runAllActions(game);

    expect(card.resourceCount).eq(3);
  });

  it('effect - placing a tile', () => {
    const card = new DemetronLabs();
    const [game, player/* , player2 */] = testGame(2, {underworldExpansion: true});

    player.corporations.push(card);

    function identify(player: IPlayer) {
      UnderworldExpansion.identify(game, UnderworldExpansion.identifiableSpaces(player)[0], player);
    }

    function simulateFinishingAction(player: IPlayer) {
      player.actionsTakenThisGame++;
      player.actionsTakenThisRound++;
    }

    identify(player);
    identify(player);

    simulateFinishingAction(player);
    runAllActions(game);
    expect(card.resourceCount).eq(1);

    identify(player);

    simulateFinishingAction(player);
    runAllActions(game);
    expect(card.resourceCount).eq(2);

    const excavatableSpaces = UnderworldExpansion.excavatableSpaces(player);
    const space = excavatableSpaces.filter((s) => !s.undergroundResources)[0];

    expect(space.undergroundResources).is.undefined;

    UnderworldExpansion.excavate(player, space);

    expect(space.undergroundResources).is.not.undefined;

    simulateFinishingAction(player);
    runAllActions(game);

    expect(card.resourceCount).eq(2);
  });

  it('canAct', () => {
    const card = new DemetronLabs();
    const [/* game */, player] = testGame(1, {underworldExpansion: true});

    card.resourceCount = 2;
    expect(card.canAct(player)).is.false;
    card.resourceCount = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new DemetronLabs();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});
    card.resourceCount = 3;

    expect(player.cardsInHand).has.length(0);

    const selectSpace = cast(card.action(player), SelectSpace);
    const space = selectSpace.spaces.find((s) => s.id === '13')!;

    expect(space.bonus).deep.eq([SpaceBonus.DRAW_CARD, SpaceBonus.DRAW_CARD]);

    selectSpace.cb(space);

    expect(card.resourceCount).eq(0);
    expect(player.cardsInHand).has.length(2);
    expect(space.player).is.undefined;
    expect(space.tile).is.undefined;
  });
});
