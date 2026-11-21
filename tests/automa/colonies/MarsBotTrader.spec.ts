import {expect} from 'chai';
import {CardName} from '@/common/cards/CardName';
import {ColonyName} from '@/common/colonies/ColonyName';
import {MarsBotShippingBoard} from '@/server/automa/colonies/MarsBotShippingBoard';
import {maybeTrade, selectTradeColony, tradeWithColony} from '@/server/automa/colonies/MarsBotTrader';
import {ColonyDeserializer} from '@/server/colonies/ColonyDeserializer';
import {Luna} from '@/server/colonies/Luna';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {fakeMarsBot} from '../FakeMarsBot';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

function setup(options: {megacredits?: number} = {}) {
  const [game, human, botPlayer] = testGame(2, {coloniesExtension: true});
  const {marsBot, calls} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: options.megacredits ?? 5,
    shippingBoard: new MarsBotShippingBoard(fakeMarsBot({game})),
  });
  return {game, human, botPlayer, marsBot, calls};
}

describe('MarsBotTrader', () => {
  // The flipped card's cost picks among the tied tiles: (cost - 1) % 2, so cost 2 picks the second
  for (const run of [
    {tiles: [{colonyName: ColonyName.LUNA, track: 5, botColony: false}, {colonyName: ColonyName.CERES, track: 3, botColony: false}], expected: ColonyName.LUNA},
    {tiles: [{colonyName: ColonyName.LUNA, track: 4, botColony: true}, {colonyName: ColonyName.CERES, track: 4, botColony: false}], expected: ColonyName.LUNA},
    {tiles: [{colonyName: ColonyName.LUNA, track: 4, botColony: false}, {colonyName: ColonyName.CERES, track: 4, botColony: false}], expected: ColonyName.CERES},
  ] as const) {
    it('trades with the tile furthest along its track, then with its colony, then by a flipped card: ' + JSON.stringify(run), () => {
      const {game, botPlayer, marsBot} = setup();
      game.colonies = run.tiles.map((tile) => {
        const colony = ColonyDeserializer.deserialize(tile.colonyName)!;
        colony.trackPosition = tile.track;
        colony.colonies = tile.botColony ? [botPlayer.id] : [];
        return colony;
      });
      game.projectDeck.drawPile.push(fakeCard({cost: 2}));

      expect(selectTradeColony(marsBot)?.name).eq(run.expected);
    });
  }

  for (const run of [
    {colonyName: ColonyName.LUNA, botColony: false, expected: {stored: 2, tr: 0, calls: ['loseMc(1)']}},
    {colonyName: ColonyName.LUNA, botColony: true, expected: {stored: 3, tr: 0, calls: ['loseMc(1)']}},
    {colonyName: ColonyName.EUROPA, botColony: false, expected: {stored: 0, tr: 1, calls: ['loseMc(1)']}},
    {colonyName: ColonyName.TITAN, botColony: false, expected: {stored: 0, tr: 0, calls: ['loseMc(1)', 'addFloaters(2)']}},
  ] as const) {
    it("pays 1 M€ and takes MarsBot's reward instead of the track's income: " + JSON.stringify(run), () => {
      const {botPlayer, marsBot, calls} = setup();
      const colony = ColonyDeserializer.deserialize(run.colonyName)!;
      colony.colonies = run.botColony ? [botPlayer.id] : [];
      const tr = botPlayer.terraformRating;

      tradeWithColony(marsBot, colony);

      expect(marsBot.shippingBoard.get(run.colonyName)).eq(run.expected.stored);
      expect(botPlayer.terraformRating - tr).eq(run.expected.tr);
      expect(calls).deep.eq(run.expected.calls);
      expect(colony.visitor).eq(botPlayer.id);
    });
  }

  it("pays the player's colony bonus and moves the track back", () => {
    const {game, human, marsBot} = setup();
    const luna = new Luna();
    luna.colonies = [human.id];
    luna.trackPosition = 5;

    tradeWithColony(marsBot, luna);
    runAllActions(game);

    expect(human.megaCredits).eq(2);
    expect(luna.trackPosition).eq(1);
  });

  for (const run of [
    {megacredits: 1, visited: false, expected: true},
    {megacredits: 0, visited: false, expected: false},
    {megacredits: 1, visited: true, expected: false},
  ] as const) {
    it('trades only with a tile to trade with and 1 M€ to pay: ' + JSON.stringify(run), () => {
      const {game, human, marsBot, calls} = setup({megacredits: run.megacredits});
      const luna = new Luna();
      luna.visitor = run.visited ? human.id : undefined;
      game.colonies = [luna];

      maybeTrade(marsBot, CardName.AUTOMA_SHIPPING_LINES);

      expect(calls.includes('loseMc(1)')).eq(run.expected);
    });
  }
});
