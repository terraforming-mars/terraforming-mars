import {CraterSurvey} from '../../../src/server/cards/underworld/CraterSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsExcavationAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('CraterSurvey', () => {
  it('Should play', () => {
    const card = new CraterSurvey();
    const [game, player] = testGame(2, {underworldExpansion: true});

    cast(card.play(player), undefined);

    runAllActions(game);

    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    assertIsExcavationAction(player, player.popWaitingFor());
    cast(player.popWaitingFor(), undefined);
  });
});
