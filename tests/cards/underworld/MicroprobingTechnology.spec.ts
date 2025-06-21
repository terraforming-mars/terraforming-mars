import {expect} from 'chai';
import {MicroprobingTechnology} from '../../../src/server/cards/underworld/MicroprobingTechnology';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('MicroprobingTechnology', () => {
  it('Should play', () => {
    const card = new MicroprobingTechnology();
    const [game, player] = testGame(2, {underworldExpansion: true});

    expect(card.canPlay(player)).is.false;
    player.tagsForTest = {science: 1};
    expect(card.canPlay(player)).is.true;

    const cryptocurrency = new Cryptocurrency();
    player.playedCards.set(cryptocurrency, new CommunicationCenter);

    cast(card.play(player), undefined);

    expect(player.stock.plants).eq(3);

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
