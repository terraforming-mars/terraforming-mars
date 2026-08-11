import {expect} from 'chai';
import {Birds} from '@/server/cards/base/Birds';
import {PhysicsComplex} from '@/server/cards/base/PhysicsComplex';
import {Tardigrades} from '@/server/cards/base/Tardigrades';
import {GainAnyResourceButScienceDeferred} from '@/server/deferredActions/GainAnyResourceButScienceDeferred';
import {OrOptions} from '@/server/inputs/OrOptions';
import {SelectCard} from '@/server/inputs/SelectCard';
import {SelectOption} from '@/server/inputs/SelectOption';
import {cast} from '@/common/utils/utils';
import {testGame} from '@tests/TestGame';

describe('GainAnyResourceButScienceDeferred', () => {
  it('selects among non-science resource cards', () => {
    const [/* game */, player] = testGame(1);
    const tardigrades = new Tardigrades();
    const birds = new Birds();
    const physicsComplex = new PhysicsComplex();
    player.playedCards.push(tardigrades, birds, physicsComplex);

    const orOptions = cast(new GainAnyResourceButScienceDeferred(player).execute(), OrOptions);
    const selectCard = cast(orOptions.options[0], SelectCard);
    expect(selectCard.cards).deep.eq([tardigrades, birds]);
    selectCard.cb([birds]);

    expect(tardigrades.resourceCount).eq(0);
    expect(birds.resourceCount).eq(1);
    expect(physicsComplex.resourceCount).eq(0);
  });

  it('offers the only resource card directly', () => {
    const [/* game */, player] = testGame(1);
    const card = new Tardigrades();
    player.playedCards.push(card);

    const orOptions = cast(new GainAnyResourceButScienceDeferred(player).execute(), OrOptions);
    const option = cast(orOptions.options[0], SelectOption);
    option.cb(undefined);

    expect(card.resourceCount).eq(1);
  });
});
