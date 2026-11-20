import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {CardName} from '@/common/cards/CardName';
import {MarsBotBonusCard} from '@/server/automa/MarsBotBonusCard';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('MarsBotBonusCards', () => {
  it('gives a blank card for an id without a class of its own', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot, calls} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const card = createBonusCard(BonusCardId.B04_OVERACHIEVEMENT);

    const kept = card.resolve(marsBot);

    expect(card.constructor).eq(MarsBotBonusCard);
    expect(card.name).eq(CardName.AUTOMA_OVERACHIEVEMENT);
    expect(calls).is.empty;
    expect(kept).is.false;
  });

  it('makes a new card each time', () => {
    expect(createBonusCard(BonusCardId.B01_METEOR_SHOWER)).not.eq(createBonusCard(BonusCardId.B01_METEOR_SHOWER));
  });
});
