import {expect} from 'chai';
import {CraterSurvey} from '../../../src/server/cards/underworld/CraterSurvey';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('CraterSurvey', () => {
  it('Should play', () => {
    const card = new CraterSurvey();
    const [game, player] = testGame(2, {underworldExpansion: true});

    const cryptocurrency = new Cryptocurrency();
    player.playedCards.push(cryptocurrency, new CommunicationCenter);

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

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([cryptocurrency]);
    expect(cryptocurrency.resourceCount).eq(2);
  });
});
