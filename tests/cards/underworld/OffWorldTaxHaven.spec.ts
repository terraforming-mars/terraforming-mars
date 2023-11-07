import {expect} from 'chai';
import {OffWorldTaxHaven} from '../../../src/server/cards/underworld/OffWorldTaxHaven';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';

describe('OffWorldTaxHaven', () => {
  it('canPlay', () => {
    const card = new OffWorldTaxHaven();
    const [, player] = testGame(1);

    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new OffWorldTaxHaven();
    const [game, player] = testGame(1);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.production.megacredits).eq(5);
  });
});
