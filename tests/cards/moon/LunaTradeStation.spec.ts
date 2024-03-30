import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaTradeStation} from '../../../src/server/cards/moon/LunaTradeStation';
import {MoonSpaces} from '../../../src/common/moon/MoonSpaces';
import {TileType} from '../../../src/common/TileType';

describe('LunaTradeStation', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: LunaTradeStation;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new LunaTradeStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.titanium = 1;
    player.stock.megacredits = card.cost;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
    player.stock.titanium = 2;
    expect(player.getPlayableCardsForTest()).does.include(card);
  });

  it('play', () => {
    player.stock.titanium = 3;
    expect(player.production.steel).eq(0);

    card.play(player);

    expect(player.stock.titanium).eq(1);

    const lunaTradeStation = moonData.moon.getSpace(MoonSpaces.LUNA_TRADE_STATION);
    expect(lunaTradeStation.player).eq(player);
    expect(lunaTradeStation.tile!.tileType).eq(TileType.LUNA_TRADE_STATION);
  });

  it('action', () => {
    player.stock.megacredits = 0;
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);

    card.action(player);
    expect(player.stock.megacredits).eq(0);

    player.stock.megacredits = 0;
    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    card.action(player);
    runAllActions(game);
    expect(player.stock.megacredits).eq(2);

    player.stock.megacredits = 0;
    spaces[1].tile = {tileType: TileType.MOON_HABITAT};
    card.action(player);
    runAllActions(game);
    expect(player.stock.megacredits).eq(4);

    player.stock.megacredits = 0;
    spaces[2].tile = {tileType: TileType.MOON_HABITAT};
    card.action(player);
    runAllActions(game);
    expect(player.stock.megacredits).eq(6);
  });
});

