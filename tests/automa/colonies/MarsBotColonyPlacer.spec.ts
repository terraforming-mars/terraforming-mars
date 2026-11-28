import {expect} from 'chai';
import {ColonyName} from '@/common/colonies/ColonyName';
import {PartyName} from '@/common/turmoil/PartyName';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';
import {placeColony, selectRandomColony} from '@/server/automa/colonies/MarsBotColonyPlacer';
import {Poseidon} from '@/server/cards/colonies/Poseidon';
import {ColonyDeserializer} from '@/server/colonies/ColonyDeserializer';
import {Europa} from '@/server/colonies/Europa';
import {Luna} from '@/server/colonies/Luna';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';
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
  it('picks a tile MarsBot can build on, and ignores the ruling policy', () => {
    const [game] = testGame(1, {automa: true, coloniesExtension: true, turmoilExtension: true});
    const botPlayer = game.marsBotPlayer!;
    const {marsBot} = recordingMarsBot({game, player: botPlayer});
    const luna = new Luna();
    luna.colonies = [botPlayer.id];
    const europa = new Europa();
    game.colonies = [luna, europa];
    setRulingParty(game, PartyName.REDS);

    expect(selectRandomColony(marsBot)).eq(europa);
  });

  for (const run of [
    {colonyName: ColonyName.LUNA, expected: {stored: 2, calls: []}},
    {colonyName: ColonyName.EUROPA, expected: {stored: 0, calls: ['placeOcean()']}},
    {colonyName: ColonyName.TITAN, expected: {stored: 0, calls: ['addFloaters(2)']}},
  ] as const) {
    it("builds a colony and takes MarsBot's reward instead of the tile's: " + JSON.stringify(run), () => {
      const {game, botPlayer, marsBot, calls} = setup();
      const colony = ColonyDeserializer.deserialize(run.colonyName)!;

      placeColony(colony, marsBot);

      expect(colony.colonies).deep.eq([botPlayer.id]);
      expect(botPlayer.production.megacredits).eq(0);
      expect(game.deferredActions.length).eq(0);
      expect(marsBot.shippingBoard.get(run.colonyName)).eq(run.expected.stored);
      expect(calls).deep.eq(run.expected.calls);
    });
  }

  it("moves the colony track up and tells MarsBot's corp and the player's cards", () => {
    const {human, marsBot, notices} = setup();
    human.playedCards.push(new Poseidon());
    const luna = new Luna();
    luna.colonies = [human.id];

    placeColony(luna, marsBot);

    expect(luna.trackPosition).eq(2);
    expect(notices).deep.eq(['notifyColonyPlaced()']);
    expect(human.production.megacredits).eq(1);
  });
});
