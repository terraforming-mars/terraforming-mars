import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {LunaConference} from '../../../src/server/cards/moon/LunaConference';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {MoonData} from '../../../src/server/moon/MoonData';
import {TileType} from '../../../src/common/TileType';
import {Scientists} from '../../../src/server/turmoil/parties/Scientists';
import {Greens} from '../../../src/server/turmoil/parties/Greens';

describe('LunaConference', () => {
  let player: TestPlayer;
  let game: IGame;
  let card: LunaConference;
  let moonData: MoonData;

  beforeEach(() => {
    [game, player] = testGame(2, {moonExpansion: true, turmoilExtension: true});
    card = new LunaConference();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    game.turmoil!.rulingParty = new Scientists();
    expect(player.getPlayableCardsForTest()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('play', () => {
    const spaces = moonData.moon.getAvailableSpacesOnLand(player);
    spaces[0].tile = {tileType: TileType.MOON_ROAD};
    spaces[1].tile = {tileType: TileType.MOON_ROAD};

    player.megaCredits = 0;
    card.play(player);

    expect(player.megaCredits).eq(4);

    spaces[0].tile = {tileType: TileType.MOON_HABITAT};
    spaces[1].tile = {tileType: TileType.MOON_HABITAT};
    spaces[2].tile = {tileType: TileType.MOON_HABITAT};

    player.megaCredits = 0;
    card.play(player);

    expect(player.megaCredits).eq(6);
  });
});

