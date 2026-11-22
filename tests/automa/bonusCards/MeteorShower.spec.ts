import {expect} from 'chai';
import {MeteorShower} from '@/server/automa/bonusCards/MeteorShower';
import {ProtectedHabitats} from '@/server/cards/base/ProtectedHabitats';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

describe('MeteorShower', () => {
  for (const run of [
    {plants: 2, expected: {plantsLeft: 0, destroyed: false}},
    {plants: 3, expected: {plantsLeft: 0, destroyed: true}},
    {plants: 7, expected: {plantsLeft: 2, destroyed: true}},
  ] as const) {
    it('removes up to 5 plants and is destroyed once 3 are lost: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
      human.plants = run.plants;

      const destroyed = new MeteorShower().resolve(marsBot);

      expect(human.plants).eq(run.expected.plantsLeft);
      expect(destroyed).eq(run.expected.destroyed);
    });
  }

  it('is destroyed without removing plants when they are protected', () => {
    const [game, human, botPlayer] = testGame(2);
    const {marsBot} = recordingMarsBot({game, player: botPlayer, humanPlayer: human});
    human.plants = 10;
    human.playedCards.push(new ProtectedHabitats());

    const destroyed = new MeteorShower().resolve(marsBot);

    expect(human.plants).eq(10);
    expect(destroyed).is.true;
  });
});
