import {expect} from 'chai';
import {MicroprobingTechnology} from '../../../src/server/cards/underworld/MicroprobingTechnology';
import {testGame} from '../../TestGame';
import {cast, runAllActions} from '../../TestingUtils';
import {UnderworldTestHelper} from '../../underworld/UnderworldTestHelper';
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

    player.playedCards = [new Cryptocurrency(), new CommunicationCenter];

    cast(card.play(player), undefined);

    expect(player.stock.plants).eq(3);

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
