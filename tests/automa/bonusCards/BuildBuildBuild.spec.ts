import {expect} from 'chai';
import {TileType} from '@/common/TileType';
import {SpaceType} from '@/common/boards/SpaceType';
import {CardName} from '@/common/cards/CardName';
import {IGame} from '@/server/IGame';
import {IPlayer} from '@/server/IPlayer';
import {MarsBotBonusDeck} from '@/server/automa/MarsBotBonusDeck';
import {MarsBotTilePlacer} from '@/server/automa/MarsBotTilePlacer';
import {BuildBuildBuild} from '@/server/automa/bonusCards/BuildBuildBuild';
import {Space} from '@/server/boards/Space';
import {NuclearZone} from '@/server/cards/base/NuclearZone';
import {IProjectCard} from '@/server/cards/IProjectCard';
import {newProjectCard} from '@/server/createCard';
import {testGame} from '../../TestGame';
import {recordingMarsBot} from '../corps/RecordingMarsBot';

/** An empty land space with no tile within two spaces of it. */
function quietSpace(game: IGame, player: IPlayer): Space {
  const board = game.board;
  const space = board.getAvailableSpacesOnLand(player).find((candidate) => {
    const adj = board.getAdjacentSpaces(candidate);
    return adj.length === 6 && adj.every((s) => s.spaceType === SpaceType.LAND &&
      board.getAdjacentSpaces(s).every((t) => t.tile === undefined));
  });
  if (space === undefined) {
    throw new Error('No quiet space');
  }
  return space;
}

function setup(playedProjectCards: Array<IProjectCard> = []) {
  const [game, human, botPlayer] = testGame(2);
  const removed: Array<IProjectCard> = [];
  const {marsBot, calls} = recordingMarsBot({
    game,
    player: botPlayer,
    humanPlayer: human,
    megacredits: 0,
    playedProjectCards,
    bonusDeck: new MarsBotBonusDeck([], [], game.rng),
    removePlayedProjectCard: (card) => removed.push(card),
  });
  return {game, human, marsBot, calls, removed};
}

describe('BuildBuildBuild', () => {
  it('places a city next to the greenery of the player and loses 5 M€', () => {
    const {game, human, marsBot, calls} = setup();
    const greenery = quietSpace(game, human);
    game.simpleAddTile(human, greenery, {tileType: TileType.GREENERY});
    const card = new BuildBuildBuild();

    const kept = card.resolve(marsBot);

    const cities = game.board.getCities(marsBot.player);
    expect(cities).has.length(1);
    expect(game.board.getAdjacentSpaces(cities[0])).includes(greenery);
    const placementMc = new MarsBotTilePlacer(marsBot).getTotalPlacementMC(cities[0]);
    expect(calls).deep.eq([`gainMc(${placementMc})`, 'loseMc(5)']);
    expect(kept).is.false;
  });

  it('places the tile of a card it played next to the city of the player, then loses the card and 3 M€', () => {
    const nuclearZone = new NuclearZone();
    const {game, human, marsBot, calls, removed} = setup([nuclearZone]);
    const city = quietSpace(game, human);
    game.simpleAddTile(human, city, {tileType: TileType.CITY});

    const kept = new BuildBuildBuild().resolve(marsBot);

    const space = game.board.getSpaceByTileCard(CardName.NUCLEAR_ZONE);
    expect(space?.tile?.tileType).eq(TileType.NUCLEAR_ZONE);
    expect(space?.player).eq(marsBot.player);
    expect(game.board.getAdjacentSpaces(city)).includes(space);
    expect(removed).deep.eq([nuclearZone]);
    const placementMc = new MarsBotTilePlacer(marsBot).getTotalPlacementMC(space!);
    expect(calls).deep.eq([`gainMc(${placementMc})`, 'loseMc(3)']);
    expect(kept).is.false;
  });

  for (const run of [
    {played: undefined, humanCity: false},
    {played: CardName.NUCLEAR_ZONE, humanCity: false},
    // Capital's tile is a city, which can't go next to the city of the player
    {played: CardName.CAPITAL, humanCity: true},
  ] as const) {
    it('with nothing to build, gains 3 M€ and goes back into the bonus deck: ' + JSON.stringify(run), () => {
      const played = run.played === undefined ? undefined : newProjectCard(run.played);
      const {game, human, marsBot, calls, removed} = setup(played === undefined ? [] : [played]);
      if (run.humanCity) {
        game.simpleAddTile(human, quietSpace(game, human), {tileType: TileType.CITY});
      }
      const card = new BuildBuildBuild();

      const kept = card.resolve(marsBot);

      const botSpaces = game.board.spaces.filter((space) => space.player === marsBot.player);
      expect(botSpaces).is.empty;
      expect(removed).is.empty;
      expect(calls).deep.eq(['gainMc(3)']);
      expect(marsBot.bonusDeck.drawPile).deep.eq([card]);
      expect(kept).is.true;
    });
  }
});
