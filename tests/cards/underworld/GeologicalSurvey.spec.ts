import {expect} from 'chai';
import {GeologicalSurvey} from '../../../src/server/cards/underworld/GeologicalSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';

describe('GeologicalSurvey', () => {
  let card: GeologicalSurvey;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new GeologicalSurvey();
    [game, player] = testGame(1, {underworldExpansion: true});
  });

  it('play', () => {
    const communicationCenter = new CommunicationCenter();
    player.playedCards.push(communicationCenter);
    cast(card.play(player), undefined);
    runAllActions(game);

    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(communicationCenter.resourceCount).eq(1);
  });
});
