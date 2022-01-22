import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {MicrosingularityPlant} from '../../../src/cards/moon/MicrosingularityPlant';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('MicrosingularityPlant', () => {
  let player: Player;
  let card: MicrosingularityPlant;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new MicrosingularityPlant();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space1 = moonData.moon.getAvailableSpacesOnLand(player)[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand(player)[1];

    space1.tile = {tileType: TileType.MOON_COLONY};
    space2.tile = {tileType: TileType.MOON_COLONY};
    expect(player.getPlayableCards()).does.include(card);

    space2.tile = {tileType: TileType.MOON_ROAD};
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    expect(player.getProduction(Resources.ENERGY)).eq(0);

    card.play(player);

    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});

