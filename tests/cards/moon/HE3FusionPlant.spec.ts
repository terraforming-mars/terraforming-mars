import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {HE3FusionPlant} from '../../../src/server/cards/moon/HE3FusionPlant';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {TileType} from '../../../src/common/TileType';

describe('HE3FusionPlant', () => {
  let player: TestPlayer;
  let card: HE3FusionPlant;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new HE3FusionPlant();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.miningRate = 2;
    expect(player.getPlayableCards()).does.include(card);

    moonData.miningRate = 1;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.production.override({energy: 0});
    card.play(player);
    expect(player.production.energy).eq(0);

    player.production.override({energy: 0});
    moonData.moon.getSpace('m06')!.tile = {tileType: TileType.MOON_MINE};
    card.play(player);
    expect(player.production.energy).eq(1);

    player.production.override({energy: 0});
    moonData.moon.getSpace('m07')!.tile = {tileType: TileType.MOON_MINE};
    card.play(player);
    expect(player.production.energy).eq(2);
  });
});

