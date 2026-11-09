import {expect} from 'chai';
import {BonusCardId} from '@/common/automa/AutomaTypes';
import {VITOR_MARSBOT_CORP} from '@/server/automa/corps/prelude/VitorMarsBot';
import {Ants} from '@/server/cards/base/Ants';
import {BiomassCombustors} from '@/server/cards/base/BiomassCombustors';
import {DustSeals} from '@/server/cards/base/DustSeals';
import {MicroMills} from '@/server/cards/base/MicroMills';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('VitorMarsBot', () => {
  it('removes Overachievement at setup, and it is its action deck bonus card', () => {
    const {marsBot, calls} = recordingMarsBot();

    VITOR_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['removeBonusCard(B04)']);
    expect(VITOR_MARSBOT_CORP.actionDeckBonusCard).eq(BonusCardId.B04_OVERACHIEVEMENT);
  });

  // The VP printed on the card counts, not what it scores now
  it('gains 3 M€ for a card whose printed VP is not negative', () => {
    const gained = [new Ants(), new DustSeals(), new BiomassCombustors(), new MicroMills()].map((card) => {
      const {marsBot, calls} = recordingMarsBot();
      VITOR_MARSBOT_CORP.effect!.onProjectCardResolved!(marsBot, card);
      return calls;
    });

    expect(gained).deep.eq([['gainMc(3)'], ['gainMc(3)'], [], []]);
  });
});
