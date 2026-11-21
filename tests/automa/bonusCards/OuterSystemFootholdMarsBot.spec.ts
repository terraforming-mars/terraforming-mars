import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {createBonusCard} from '@/server/automa/MarsBotBonusCard';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {OuterSystemFootholdMarsBot} from '@/server/automa/bonusCards/OuterSystemFootholdMarsBot';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('OuterSystemFootholdMarsBot', () => {
  it('places a colony, then draws a bonus card and discards it without resolving it', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const investors = createBonusCard(BonusCardId.B32_INVESTORS);
    const meteorShower = createBonusCard(BonusCardId.B01_METEOR_SHOWER);
    const {marsBot, calls} = recordingMarsBot({game, bonusDeck: new MarsBotBonusDeck([meteorShower, investors], [], game.rng)});

    const kept = new OuterSystemFootholdMarsBot().resolve(marsBot);

    expect(calls).deep.eq(['maybePlaceRandomColony()']);
    expect(marsBot.bonusDeck.drawPile).deep.eq([meteorShower]);
    expect(marsBot.bonusDeck.discardPile).deep.eq([investors]);
    expect(kept).is.false;
  });

  it('keeps itself out of the reshuffle when the draw pile is empty', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const self = createBonusCard(BonusCardId.B18_OUTER_SYSTEM_FOOTHOLD);
    const investors = createBonusCard(BonusCardId.B32_INVESTORS);
    const {marsBot} = recordingMarsBot({game, bonusDeck: new MarsBotBonusDeck([], [self, investors], game.rng)});

    new OuterSystemFootholdMarsBot().resolve(marsBot);

    expect(marsBot.bonusDeck.drawPile).is.empty;
    expect(marsBot.bonusDeck.discardPile).deep.eq([self, investors]);
  });
});
