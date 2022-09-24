import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {MicrosingularityPlant} from '../../../src/server/cards/moon/MicrosingularityPlant';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';

describe('MicrosingularityPlant', () => {
  let player: Player;
  let card: MicrosingularityPlant;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    card = new MicrosingularityPlant();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space1 = moonData.moon.getAvailableSpacesOnLand(player)[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand(player)[1];

    space1.tile = {tileType: TileType.MOON_HABITAT};
    space2.tile = {tileType: TileType.MOON_HABITAT};
    expect(player.getPlayableCards()).does.include(card);

    space2.tile = {tileType: TileType.MOON_ROAD};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    expect(player.production.energy).eq(0);

    card.play(player);

    expect(player.production.energy).eq(2);
  });
});

