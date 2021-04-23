import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaTradeStation} from '../../../src/cards/moon/LunaTradeStation';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {MoonSpaces} from '../../../src/moon/MoonSpaces';
import {TileType} from '../../../src/TileType';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaTradeStation', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: LunaTradeStation;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new LunaTradeStation();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 1;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 2;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.getProduction(Resources.STEEL)).eq(0);

    card.play(player);

    expect(player.titanium).eq(1);

    const lunaTradeStation = moonData.moon.getSpace(MoonSpaces.LUNA_TRADE_STATION);
    expect(lunaTradeStation.player).eq(player);
    expect(lunaTradeStation.tile!.tileType).eq(TileType.LUNA_TRADE_STATION);
  });

  it('action', () => {
    player.megaCredits = 0;
    const spaces = moonData.moon.getNonReservedLandSpaces();

    card.action(player);
    expect(player.megaCredits).eq(0);

    player.megaCredits = 0;
    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    card.action(player);
    expect(player.megaCredits).eq(2);

    player.megaCredits = 0;
    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    card.action(player);
    expect(player.megaCredits).eq(4);

    player.megaCredits = 0;
    spaces[2].tile = {tileType: TileType.MOON_COLONY};
    card.action(player);
    expect(player.megaCredits).eq(6);
  });
});

