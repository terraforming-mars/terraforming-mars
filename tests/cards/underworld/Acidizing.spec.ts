import {expect} from 'chai';
import {Acidizing} from '../../../src/server/cards/underworld/Acidizing';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction} from '../../underworld/underworldAssertions';

describe('Acidizing', () => {
  it('Should play', () => {
    const card = new Acidizing();
    const [game, player] = testGame(2, {underworldExpansion: true, venusNextExtension: true});
    expect(game.getVenusScaleLevel()).eq(0);

    cast(card.play(player), undefined);
    expect(game.getVenusScaleLevel()).eq(2);

    runAllActions(game);

    assertIsExcavationAction(player, player.popWaitingFor());

    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
