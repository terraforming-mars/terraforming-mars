import {expect} from 'chai';
import {TunnelingOperation} from '../../../src/server/cards/underworld/TunnelingOperation';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('TunnelingOperation', () => {
  it('Should play', () => {
    const card = new TunnelingOperation();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);
    runAllActions(game);

    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.production.steel).eq(2);
  });
});
