import {expect} from 'chai';
import {DELEGATES_PER_PLAYER} from '@/common/constants';
import {SeptumTribusMarsBot} from '@/server/automa/corps/turmoil/SeptumTribusMarsBot';
import {testGame} from '../../../TestGame';
import {recordingMarsBot} from '../RecordingMarsBot';

describe('SeptumTribusMarsBot', () => {
  it('setup swaps Party Politics for Gray Eminence and adds the delegates of an unused colour to MarsBot', () => {
    const [game] = testGame(1, {automa: true, turmoilExtension: true});
    const {marsBot, calls} = recordingMarsBot({game, player: game.marsBotPlayer});

    new SeptumTribusMarsBot().setup(marsBot);

    expect(calls).deep.eq(['removeBonusCard(B21)', 'addBonusCardToBonusDeck(B29)']);
    expect(game.turmoil!.delegateReserve.get(marsBot.player)).eq(2 * DELEGATES_PER_PLAYER);
  });

  it('adds Gray Eminence to the action deck before the action phase', () => {
    const {marsBot, calls} = recordingMarsBot();

    new SeptumTribusMarsBot().beforeActionPhase(marsBot);

    expect(calls).deep.eq(['addBonusCardToActionDeck(B29)']);
  });
});
