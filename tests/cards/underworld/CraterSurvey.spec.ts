import {CraterSurvey} from '../../../src/server/cards/underworld/CraterSurvey';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {cast} from '../../../src/common/utils/utils';

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
    assertIsClaimAction(player, player.popWaitingFor());
    cast(player.popWaitingFor(), undefined);
  });
});
