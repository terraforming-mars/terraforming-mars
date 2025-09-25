import {expect} from 'chai';
import {UndergroundHabitat} from '../../../src/server/cards/underworld/UndergroundHabitat';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';
import {Birds} from '../../../src/server/cards/base/Birds';
import {Penguins} from '../../../src/server/cards/promo/Penguins';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('UndergroundHabitat', () => {
  it('Should play', () => {
    const card = new UndergroundHabitat();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const birds = new Birds();
    player.playedCards.set(birds, new Penguins());

    cast(card.play(player), undefined);

    expect(player.production.plants).eq(1);
    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([birds]);
    expect(birds.resourceCount).eq(1);
  });
});
