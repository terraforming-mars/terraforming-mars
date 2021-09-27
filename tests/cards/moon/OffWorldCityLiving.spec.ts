import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {OffWorldCityLiving} from '../../../src/cards/moon/OffWorldCityLiving';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/TileType';
import {SpaceType} from '../../../src/SpaceType';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('OffWorldCityLiving', () => {
  let player: Player;
  let card: OffWorldCityLiving;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    // Adding a vestigial player to avoid the two starting cities.
    const game = Game.newInstance('id', [player, TestPlayers.RED.newPlayer()], player, MOON_OPTIONS);
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
    expect(player.getProduction(Resources.MEGACREDITS)).eq(0);

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
    expect(player.getProduction(Resources.MEGACREDITS)).eq(2);
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

