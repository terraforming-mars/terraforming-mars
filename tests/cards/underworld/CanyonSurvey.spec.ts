import {CanyonSurvey} from '../../../src/server/cards/underworld/CanyonSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {assertIsClaimAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('CanyonSurvey', () => {
  let card: CanyonSurvey;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new CanyonSurvey();
    [game, player] = testGame(1, {underworldExpansion: true});
  });

  it('play', () => {
    cast(card.play(player), undefined);

    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
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
