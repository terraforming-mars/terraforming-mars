import {expect} from 'chai';
import {GovernmentSubsidyMarsBot} from '@/server/automa/bonusCards/GovernmentSubsidyMarsBot';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('GovernmentSubsidyMarsBot', () => {
  it('raises TR 1 step', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const tr = botPlayer.terraformRating;

    new GovernmentSubsidyMarsBot().resolve(marsBot);

    expect(botPlayer.terraformRating).eq(tr + 1);
  });
});
