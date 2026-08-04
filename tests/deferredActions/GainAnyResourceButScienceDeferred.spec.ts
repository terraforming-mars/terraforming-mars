import {expect} from 'chai';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {GainAnyResourceButScienceDeferred} from '../../src/server/deferredActions/GainAnyResourceButScienceDeferred';
import {OrOptions} from '../../src/server/inputs/OrOptions';
import {SelectOption} from '../../src/server/inputs/SelectOption';
import {cast} from '../../src/common/utils/utils';
import {testGame} from '../TestGame';

describe('GainAnyResourceButScienceDeferred', () => {
  it('offers the only resource card directly', () => {
    const [/* game */, player] = testGame(1, {underworldExpansion: true});
    const card = new Tardigrades();
    player.playedCards.push(card);

    const input = cast(new GainAnyResourceButScienceDeferred(player).execute(), OrOptions);
    const option = cast(input.options[0], SelectOption);
    option.cb(undefined);

    expect(card.resourceCount).eq(1);
  });
});
