import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {HypersensitiveSiliconChipFactory} from '../../../src/cards/moon/HypersensitiveSiliconChipFactory';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TileType} from '../../../src/TileType';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HypersensitiveSiliconChipFactory', () => {
  let player: TestPlayer;
  let card: HypersensitiveSiliconChipFactory;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new HypersensitiveSiliconChipFactory();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    const space1 = moonData.moon.getAvailableSpacesOnLand(player)[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand(player)[1];

    space1.tile = {tileType: TileType.MOON_MINE};
    space2.tile = {tileType: TileType.MOON_MINE};

    player.titanium = 2;
    player.setProductionForTest({energy: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    player.setProductionForTest({energy: 2});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 2;
    space2.tile = {tileType: TileType.MOON_COLONY};
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.setProductionForTest({megacredits: 0});
    player.titanium = 2;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
  });
});

