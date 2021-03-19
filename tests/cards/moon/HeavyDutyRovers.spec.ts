import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {HeavyDutyRovers} from '../../../src/cards/moon/HeavyDutyRovers';
import {expect} from 'chai';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HeavyDutyRovers', () => {
  let player: TestPlayer;
  let card: HeavyDutyRovers;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

