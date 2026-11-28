import {expect} from 'chai';
import {GovernmentSubsidy} from '@/server/automa/bonusCards/GovernmentSubsidy';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('GovernmentSubsidy', () => {
  it('raises TR 1 step', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    const tr = botPlayer.terraformRating;

    new GovernmentSubsidy().resolve(marsBot);

    expect(botPlayer.terraformRating).eq(tr + 1);
  });
});
