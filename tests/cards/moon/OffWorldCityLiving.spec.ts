import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {OffWorldCityLiving} from '../../../src/server/cards/moon/OffWorldCityLiving';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('OffWorldCityLiving', () => {
  let player: Player;
  let card: OffWorldCityLiving;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    // Adding a vestigial player to avoid the two starting cities.
    const game = Game.newInstance('gameid', [player, TestPlayer.RED.newPlayer()], player, testGameOptions({moonExpansion: true}));
    card = new OffWorldCityLiving();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    expect(moonData.colonyRate).eq(0);
    expect(player.getTerraformRating()).eq(20);
    expect(player.production.megacredits).eq(0);

    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    colonySpaces[1].tile = {tileType: TileType.CITY};

    const landSpaces = player.game.board.getAvailableSpacesOnLand(player);
    landSpaces[0].tile = {tileType: TileType.CITY};
    landSpaces[1].tile = {tileType: TileType.CITY};
    landSpaces[2].tile = {tileType: TileType.CITY};

    card.play(player);

    expect(moonData.colonyRate).eq(1);
    expect(player.getTerraformRating()).eq(21);
    expect(player.production.megacredits).eq(2);
  });

  it('getVictoryPoints', () => {
    expect(card.getVictoryPoints(player)).eq(0);
    const colonySpaces = player.game.board.spaces.filter((s) => s.spaceType === SpaceType.COLONY);
    colonySpaces[0].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(0);
    colonySpaces[1].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(0);

    const landSpaces = player.game.board.getAvailableSpacesOnLand(player);
    landSpaces[0].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(1);
    landSpaces[1].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(1);
    landSpaces[2].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(1);
    landSpaces[3].tile = {tileType: TileType.CITY};
    expect(card.getVictoryPoints(player)).eq(2);
  });
});

