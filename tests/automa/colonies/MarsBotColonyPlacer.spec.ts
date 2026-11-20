import {expect} from 'chai';
import {ColonyName} from '@/common/colonies/ColonyName';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';
import {eligibleColoniesForMarsBot, placeColonyForMarsBot} from '@/server/automa/colonies/MarsBotColonyPlacer';
import {Poseidon} from '@/server/cards/colonies/Poseidon';
import {ColonyDeserializer} from '@/server/colonies/ColonyDeserializer';
import {Luna} from '@/server/colonies/Luna';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

function setup() {
  const [game, human, botPlayer] = testGame(2, {coloniesExtension: true});
  const notices: Array<string> = [];
  const {marsBot, calls} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    shippingBoard: new MarsBotShippingBoard(fakeMarsBot({game})),
    notifyColonyPlaced: () => notices.push('notifyColonyPlaced()'),
  });
  return {game, human, botPlayer, marsBot, calls, notices};
}

describe('MarsBotColonyPlacer', () => {
  for (const run of [
    {isActive: true, colonies: [], expected: true},
    {isActive: false, colonies: [], expected: false},
    {isActive: true, colonies: ['human', 'human', 'human'], expected: false},
    {isActive: true, colonies: ['bot'], expected: false},
  ] as const) {
    it('lists the tiles MarsBot can build on: ' + JSON.stringify(run), () => {
      const {game, human, botPlayer, marsBot} = setup();
      const luna = new Luna();
      luna.isActive = run.isActive;
      luna.colonies = run.colonies.map((owner) => owner === 'bot' ? botPlayer.id : human.id);
      game.colonies = [luna];

      expect(eligibleColoniesForMarsBot(marsBot)).deep.eq(run.expected ? [luna] : []);
    });
  }

  for (const run of [
    {colonyName: ColonyName.LUNA, expected: {stored: 2, calls: []}},
    {colonyName: ColonyName.EUROPA, expected: {stored: 0, calls: ['placeOcean()']}},
    {colonyName: ColonyName.TITAN, expected: {stored: 0, calls: ['addFloaters(2)']}},
  ] as const) {
    it("builds a colony and takes MarsBot's reward instead of the tile's: " + JSON.stringify(run), () => {
      const {botPlayer, marsBot, calls} = setup();
      const colony = ColonyDeserializer.deserialize(run.colonyName)!;

      placeColonyForMarsBot(colony, marsBot);

      expect(colony.colonies).deep.eq([botPlayer.id]);
      expect(marsBot.shippingBoard.get(run.colonyName)).eq(run.expected.stored);
      expect(calls).deep.eq(run.expected.calls);
    });
  }

  it("moves the colony track up and tells MarsBot's corp and the player's cards", () => {
    const {human, marsBot, notices} = setup();
    human.playedCards.push(new Poseidon());
    const luna = new Luna();
    luna.colonies = [human.id];

    placeColonyForMarsBot(luna, marsBot);

    expect(luna.trackPosition).eq(2);
    expect(notices).deep.eq(['notifyColonyPlaced()']);
    expect(human.production.megacredits).eq(1);
  });
});
