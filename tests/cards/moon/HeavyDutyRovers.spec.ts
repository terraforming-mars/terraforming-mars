import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HeavyDutyRovers} from '../../../src/server/cards/moon/HeavyDutyRovers';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';

describe('HeavyDutyRovers', () => {
  let player: TestPlayer;
  let card: HeavyDutyRovers;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new HeavyDutyRovers();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.megaCredits = 0;
    moonData.logisticRate = 0;
    expect(player.getTerraformRating()).eq(14);

    moonData.moon.getSpace('m07')!.tile = {tileType: TileType.MOON_MINE};
    moonData.moon.getSpace('m06')!.tile = {tileType: TileType.MOON_ROAD};
    moonData.moon.getSpace('m02')!.tile = {tileType: TileType.MOON_MINE};

    card.play(player);

    expect(player.megaCredits).eq(8);
    expect(moonData.logisticRate).eq(1);
    expect(player.getTerraformRating()).eq(15);
  });
});

