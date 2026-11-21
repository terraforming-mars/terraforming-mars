import {expect} from 'chai';
import {ColonyName} from '@/common/colonies/ColonyName';
import {PartyName} from '@/common/turmoil/PartyName';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';
import {eligibleColonies, placeColony} from '@/server/automa/colonies/MarsBotColonyPlacer';
import {Poseidon} from '@/server/cards/colonies/Poseidon';
import {ColonyDeserializer} from '@/server/colonies/ColonyDeserializer';
import {Europa} from '@/server/colonies/Europa';
import {Luna} from '@/server/colonies/Luna';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';
import {fakeMarsBot} from '../FakeMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

function setup(options: {turmoilExtension?: boolean} = {}) {
  const [game, human, botPlayer] = testGame(2, {coloniesExtension: true, ...options});
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

      expect(eligibleColonies(marsBot)).deep.eq(run.expected ? [luna] : []);
    });
  }

  it('lists Europa while Reds rule, since MarsBot ignores the ruling policy', () => {
    const {game, marsBot} = setup({turmoilExtension: true});
    const europa = new Europa();
    game.colonies = [europa];
    setRulingParty(game, PartyName.REDS);

    expect(eligibleColonies(marsBot)).deep.eq([europa]);
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
