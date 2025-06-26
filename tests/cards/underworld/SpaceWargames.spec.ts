import {expect} from 'chai';
import {SpaceWargames} from '../../../src/server/cards/underworld/SpaceWargames';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {OrOptions} from '../../../src/server/inputs/OrOptions';

describe('SpaceWargames', () => {
  it('play', () => {
    const card = new SpaceWargames();
    const [game, player] = testGame(2);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(card.resourceCount).to.eq(1);
  });

  it('canAct', () => {
    const card = new SpaceWargames();
    const [/* game */, player] = testGame(2);

    expect(card.canAct(player)).is.false;

    card.resourceCount = 1;

    expect(card.canAct(player)).is.true;

    card.resourceCount = 0;
    player.titanium = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new SpaceWargames();
    const [game, player] = testGame(2);

    card.resourceCount = 1;
    player.titanium = 1;

    cast(card.action(player), undefined);

    runAllActions(game);
    const orOptions = cast(player.popWaitingFor(), OrOptions);
    orOptions.options[0].cb();
    runAllActions(game);

    expect(player.titanium).eq(0);
    expect(card.resourceCount).eq(2);

    orOptions.options[1].cb();
    runAllActions(game);

    expect(card.resourceCount).eq(1);
    expect(player.megaCredits).eq(6);
  });
});
