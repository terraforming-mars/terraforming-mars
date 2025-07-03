import {expect} from 'chai';
import {MicroprobingTechnology} from '../../../src/server/cards/underworld/MicroprobingTechnology';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('MicroprobingTechnology', () => {
  it('Should play', () => {
    const card = new MicroprobingTechnology();
    const [game, player] = testGame(2, {underworldExpansion: true});

    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.true;

    cast(card.play(player), undefined);

    expect(player.stock.plants).eq(3);

    runAllActions(game);

    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsClaimAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
