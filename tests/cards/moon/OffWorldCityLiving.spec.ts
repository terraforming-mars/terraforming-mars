import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {OffWorldCityLiving} from '../../../src/server/cards/moon/OffWorldCityLiving';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';
import {SpaceType} from '../../../src/common/boards/SpaceType';

describe('OffWorldCityLiving', () => {
  let game: IGame;
  let player: TestPlayer;
  let card: OffWorldCityLiving;
  let moonData: MoonData;

  beforeEach(() => {
    // Adding a vestigial player to avoid the two starting cities.
    [game, player] = testGame(2, {moonExpansion: true});
    card = new OffWorldCityLiving();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    expect(moonData.habitatRate).eq(0);
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

    expect(moonData.habitatRate).eq(1);
    expect(player.getTerraformRating()).eq(21);
    expect(player.production.megacredits).eq(2);
  });

  it('getVictoryPoints', () => {
    player.playedCards.push(card);
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

