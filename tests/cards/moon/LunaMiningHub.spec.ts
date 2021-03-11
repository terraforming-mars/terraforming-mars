import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaMiningHub} from '../../../src/cards/moon/LunaMiningHub';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {TileType} from '../../../src/TileType';
import {PlaceSpecialMoonTile} from '../../../src/moon/PlaceSpecialMoonTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaMiningHub', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaMiningHub;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaMiningHub();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    player.steel = 1;
    moonData.miningRate = 5;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    player.steel = 1;
    moonData.miningRate = 5;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.steel = 0;
    moonData.miningRate = 5;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.steel = 1;
    moonData.miningRate = 4;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    player.steel = 3;
    expect(player.getProduction(Resources.STEEL)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(2);
    expect(player.getProduction(Resources.STEEL)).eq(1);
    expect(player.getProduction(Resources.TITANIUM)).eq(1);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.miningRate).eq(1);

    const placeTileAction = game.deferredActions.pop() as PlaceSpecialMoonTile;
    const space = moonData.moon.spaces[10];
    placeTileAction!.execute()!.cb(space);

    expect(moonData.miningRate).eq(1);
    expect(player.getTerraformRating()).eq(15);

    expect(space.player).eq(player);
    expect(space.tile!.tileType).eq(TileType.LUNA_MINING_HUB);
    expect(space.tile!.card).eq(card.name);
  });

  it('getVictoryPoints', () => {
    // This space has room to surround it with mines.
    const space = moonData.moon.getSpace('m15');
    space.tile = {tileType: TileType.LUNA_MINING_HUB, card: card.name};

    expect(card.getVictoryPoints(player)).eq(0);
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(space);

    adjacentSpaces[0].tile = {tileType: TileType.MOON_MINE};
    expect(card.getVictoryPoints(player)).eq(2);

    adjacentSpaces[1].tile = {tileType: TileType.MOON_MINE};
    expect(card.getVictoryPoints(player)).eq(4);

    adjacentSpaces[2].tile = {tileType: TileType.MOON_MINE};
    expect(card.getVictoryPoints(player)).eq(6);
  });
});

