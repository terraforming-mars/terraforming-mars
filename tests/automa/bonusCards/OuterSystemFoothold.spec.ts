import {expect} from 'chai';
import {BonusCardName} from '@/common/automa/BonusCardName';
import {createBonusCard} from '@/server/automa/bonusCards/MarsBotBonusCards';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {OuterSystemFoothold} from '@/server/automa/bonusCards/OuterSystemFoothold';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('OuterSystemFoothold', () => {
  it('places a colony, then draws a bonus card and discards it without resolving it', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const investors = createBonusCard(BonusCardName.INVESTORS);
    const meteorShower = createBonusCard(BonusCardName.METEOR_SHOWER);
    const {marsBot, calls} = recordingMarsBot({game, bonusDeck: new MarsBotBonusDeck([meteorShower, investors], [], game.rng)});

    const kept = new OuterSystemFoothold().resolve(marsBot);

    expect(calls).deep.eq(['maybePlaceRandomColony()']);
    expect(marsBot.bonusDeck.drawPile).deep.eq([meteorShower]);
    expect(marsBot.bonusDeck.discardPile).deep.eq([investors]);
    expect(kept).is.false;
  });

  it('keeps itself out of the reshuffle when the draw pile is empty', () => {
    const [game] = testGame(1, {coloniesExtension: true});
    const self = createBonusCard(BonusCardName.OUTER_SYSTEM_FOOTHOLD);
    const investors = createBonusCard(BonusCardName.INVESTORS);
    const {marsBot} = recordingMarsBot({game, bonusDeck: new MarsBotBonusDeck([], [self, investors], game.rng)});

    new OuterSystemFoothold().resolve(marsBot);

    expect(marsBot.bonusDeck.drawPile).is.empty;
    expect(marsBot.bonusDeck.discardPile).deep.eq([self, investors]);
  });
});
