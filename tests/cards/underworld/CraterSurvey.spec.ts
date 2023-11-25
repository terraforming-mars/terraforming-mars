import {expect} from 'chai';
import {CraterSurvey} from '../../../src/server/cards/underworld/CraterSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('CraterSurvey', () => {
  it('Should play', () => {
    const card = new CraterSurvey();
    const [game, player] = testGame(2, {underworldExpansion: true});

    player.playedCards = [new Cryptocurrency(), new CommunicationCenter];

    cast(card.play(player), undefined);

    runAllActions(game);

    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);
    UnderworldTestHelper.assertIsIdentificationAction(player, player.popWaitingFor());
    runAllActions(game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([player.playedCards[0]]);
    expect(player.playedCards[0].resourceCount).eq(2);
  });
});
