import {expect} from 'chai';
import {PrivateMilitaryContractor} from '../../../src/server/cards/underworld/PrivateMilitaryContractor';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('PrivateMilitaryContractor', () => {
  // Effect tests are in UnderworldExpansion.spec.ts

  it('canAct', () => {
    const card = new PrivateMilitaryContractor();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.titanium = 0;

    expect(card.canAct(player)).is.false;

    player.titanium = 1;

    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    const card = new PrivateMilitaryContractor();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.titanium = 2;
    cast(card.action(player), undefined);
    runAllActions(game);

    expect(player.titanium).eq(1);
    expect(card.resourceCount).eq(1);
  });
});
