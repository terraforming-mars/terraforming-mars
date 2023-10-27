import {expect} from 'chai';
import {Nightclubs} from '../../../src/server/cards/underworld/Nightclubs';
import {testGame} from '../../TestGame';
import {addCity, cast, runAllActions} from '../../TestingUtils';

describe('Nightclubs', () => {
  it('canPlay', () => {
    const card = new Nightclubs();
    const [/* skipped */, player] = testGame(1);

    expect(card.canPlay(player)).is.false;

    addCity(player);

    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    const card = new Nightclubs();
    const [game, player] = testGame(1);

    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.underworldData.corruption).eq(1);
    expect(player.production.megacredits).eq(2);
  });
});
