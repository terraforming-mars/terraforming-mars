import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {LocalNeuralInstance} from '@/server/automa/bonusCards/LocalNeuralInstance';
import {Space} from '@/server/boards/Space';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {Mine} from '@/server/cards/base/Mine';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

/** Covers the board with the player's greeneries until no space is left for the Neural Instance tile. */
function leaveNoNeuralInstanceSpace(marsBot: IMarsBot): void {
  const placer = new MarsBotTilePlacer(marsBot);
  for (let space = placer.findNeuralInstanceSpace(); space !== undefined; space = placer.findNeuralInstanceSpace()) {
    marsBot.game.simpleAddTile(marsBot.humanPlayer, space, {tileType: TileType.GREENERY});
  }
}

describe('LocalNeuralInstance', () => {
  for (const run of [
    {spaceLeft: true, expected: {placed: 1, played: 0, destroyed: true}},
    {spaceLeft: false, expected: {placed: 0, played: 1, destroyed: false}},
  ] as const) {
    it('places its tile and is destroyed, otherwise resolves a project card and is kept: ' + JSON.stringify(run), () => {
      const [game, human, botPlayer] = testGame(2);
      const placed: Array<Space> = [];
      const played: Array<IProjectCard> = [];
      const {marsBot} = recordingMarsBot({
        game,
        player: botPlayer,
        humanPlayer: human,
        megacredits: 0,
        placeNeuralInstance: (space) => placed.push(space),
        resolveProjectCard: (card) => played.push(card),
      });
      if (!run.spaceLeft) {
        leaveNoNeuralInstanceSpace(marsBot);
      }
      game.projectDeck.drawPile.push(new Mine());

      const destroyed = new LocalNeuralInstance().resolve(marsBot);

      expect(placed).has.length(run.expected.placed);
      expect(played).has.length(run.expected.played);
      expect(destroyed).eq(run.expected.destroyed);
    });
  }
});
