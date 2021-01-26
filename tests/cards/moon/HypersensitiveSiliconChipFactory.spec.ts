import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {HypersensitiveSiliconChipFactory} from '../../../src/cards/moon/HypersensitiveSiliconChipFactory';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('HypersensitiveSiliconChipFactory', () => {
  let player: Player;
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

    const space1 = moonData.moon.getAvailableSpacesOnLand()[0];
    const space2 = moonData.moon.getAvailableSpacesOnLand()[1];

    space1.tile = {tileType: TileType.MOON_MINE};
    space2.tile = {tileType: TileType.MOON_MINE};

    player.titanium = 2;
    setPlayerProductionForTest(player, {energy: 2});
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 1;
    setPlayerProductionForTest(player, {energy: 2});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 2;
    space2.tile = {tileType: TileType.MOON_COLONY};
    setPlayerProductionForTest(player, {energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    setPlayerProductionForTest(player, {megacredits: 0});
    player.titanium = 2;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
  });
});

