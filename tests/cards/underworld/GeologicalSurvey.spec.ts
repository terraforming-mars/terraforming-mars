import {GeologicalSurvey} from '../../../src/server/cards/underworld/GeologicalSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {assertIsExcavationAction, assertIsIdentificationAction} from '../../underworld/underworldAssertions';

describe('GeologicalSurvey', () => {
  let card: GeologicalSurvey;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GeologicalSurvey();
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
    assertIsExcavationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
  });
});
