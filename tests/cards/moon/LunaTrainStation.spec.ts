import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaTrainStation} from '../../../src/cards/moon/LunaTrainStation';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {TileType} from '../../../src/common/TileType';
import {PlaceSpecialMoonTile} from '../../../src/moon/PlaceSpecialMoonTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaTrainStation', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaTrainStation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaTrainStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.steel = 2;
    moonData.logisticRate = 5;
    expect(player.getPlayableCards()).does.include(card);

    player.steel = 2;
    moonData.logisticRate = 4;
    expect(player.getPlayableCards()).does.not.include(card);

    player.steel = 1;
    moonData.logisticRate = 5;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.steel = 3;
    expect(player.getProduction(Resources.STEEL)).eq(0);
    expect(player.getTerraformRating()).eq(14);
    expect(moonData.miningRate).eq(0);

    card.play(player);

    expect(player.steel).eq(1);
    expect(player.getProduction(Resources.MEGACREDITS)).eq(4);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.logisticRate).eq(1);

    const space = moonData.moon.spaces[2];
    const placeTileAction = game.deferredActions.peek() as PlaceSpecialMoonTile;
    placeTileAction!.execute()!.cb(space);

    expect(space.player).eq(player);
    expect(space.tile!.tileType).eq(TileType.LUNA_TRAIN_STATION);
    expect(space.tile!.card).eq(card.name);
  });

  it('getVictoryPoints', () => {
    // This space has room to surround it with roads.
    const space = moonData.moon.getSpace('m15');
    space.tile = {tileType: TileType.LUNA_TRAIN_STATION, card: card.name};

    expect(card.getVictoryPoints(player)).eq(0);
    const adjacentSpaces = moonData.moon.getAdjacentSpaces(space);

    adjacentSpaces[0].tile = {tileType: TileType.MOON_ROAD};
    expect(card.getVictoryPoints(player)).eq(2);

    adjacentSpaces[1].tile = {tileType: TileType.MOON_ROAD};
    expect(card.getVictoryPoints(player)).eq(4);

    adjacentSpaces[2].tile = {tileType: TileType.MOON_ROAD};
    expect(card.getVictoryPoints(player)).eq(6);
  });
});

