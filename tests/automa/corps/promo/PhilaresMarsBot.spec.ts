import {expect} from 'chai';
import {Phase} from '@/common/Phase';
import {TileType} from '@/common/TileType';
import {SpaceType} from '@/common/boards/SpaceType';
import {PHILARES_MARSBOT_CORP} from '@/server/automa/corps/promo/PhilaresMarsBot';
import {testGame} from '../../../TestGame';
import {TestPlayer} from '../../../TestPlayer';
import {RecordingMarsBot, recordingMarsBot} from '../RecordingMarsBot';

type Sides = RecordingMarsBot & {botPlayer: TestPlayer, human: TestPlayer};

/** A recording bot on a 2-player game. `botPlayer` owns MarsBot's tiles. */
function sides(): Sides {
  const [game, human, botPlayer] = testGame(2);
  return {...recordingMarsBot({game, player: botPlayer, humanPlayer: human}), botPlayer, human};
}

/** Puts `others` tiles of the other side and `own` of the placer's around an empty space, puts a tile on it and runs Philares. */
function placeTile({marsBot, botPlayer, human}: Sides, byMarsBot: boolean, tileType: TileType, others: number, own: number = 0): void {
  const [placer, other] = byMarsBot ? [botPlayer, human] : [human, botPlayer];
  const board = marsBot.game.board;
  const space = board.getAvailableSpacesOnLand(placer).find((s) => {
    const adjacent = board.getAdjacentSpaces(s);
    return adjacent.length === 6 && adjacent.every((a) => a.spaceType === SpaceType.LAND && a.tile === undefined);
  })!;
  board.getAdjacentSpaces(space).slice(0, others + own).forEach((s, i) => {
    marsBot.game.simpleAddTile(i < others ? other : placer, s, {tileType: TileType.GREENERY});
  });
  marsBot.game.simpleAddTile(placer, space, {tileType});

  PHILARES_MARSBOT_CORP.effect!.onTilePlaced!(marsBot, byMarsBot, tileType, space);
}

describe('PhilaresMarsBot', () => {
  it('places a greenery, resolves Local Neural Instance and starts with one science resource', () => {
    const {marsBot, calls, corpState} = sides();

    PHILARES_MARSBOT_CORP.setup!(marsBot);

    expect(calls).deep.eq(['placeGreenery()', 'removeBonusCard(B07)', 'resolveBonusCard(B07)', 'addBonusCardToBonusDeck(B27)']);
    expect(corpState.get('scienceResources')).eq(1);
  });

  // C22: each adjacency between the two sides' tiles, whoever just placed the tile
  for (const byMarsBot of [true, false]) {
    it(`gains a science resource for each of the other side's tiles that a tile placed by ${byMarsBot ? 'MarsBot' : 'the player'} touches`, () => {
      const bot = sides();

      placeTile(bot, byMarsBot, TileType.CITY, 2, 1);

      expect(bot.corpState.get('scienceResources')).eq(2);
    });
  }

  it('spends 4 science resources per advance of its most-advanced track that is not maxed, but not for oceans or after the game has ended', () => {
    const bot = sides();
    const {marsBot, calls, corpState} = bot;
    marsBot.marsBotBoard.tracks[0].position = marsBot.marsBotBoard.tracks[0].definition.layout.length - 1;
    marsBot.marsBotBoard.tracks[1].position = 10;

    placeTile(bot, true, TileType.OCEAN, 1);
    expect(corpState.get('scienceResources')).is.undefined;

    corpState.set('scienceResources', 7);
    placeTile(bot, true, TileType.CITY, 1);
    expect(calls).deep.eq(['advanceTrack(1)', 'advanceTrack(1)']);
    expect(corpState.get('scienceResources')).eq(0);

    // Nothing advances after the game has ended (BGG 3513998)
    marsBot.game.phase = Phase.END;
    corpState.set('scienceResources', 3);
    placeTile(bot, true, TileType.CITY, 1);
    expect(calls).has.length(2);
    expect(corpState.get('scienceResources')).eq(4);
  });
});
