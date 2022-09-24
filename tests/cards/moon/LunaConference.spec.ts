import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {LunaConference} from '../../../src/server/cards/moon/LunaConference';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';
import {Scientists} from '../../../src/server/turmoil/parties/Scientists';
import {Greens} from '../../../src/server/turmoil/parties/Greens';

describe('LunaConference', () => {
  let player: Player;
  let game: Game;
  let card: LunaConference;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true, turmoilExtension: true}));
    card = new LunaConference();
    moonData = MoonExpansion.moonData(game);
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    game.turmoil!.rulingParty = new Scientists();
    expect(player.getPlayableCards()).does.include(card);

    game.turmoil!.rulingParty = new Greens();
    expect(player.getPlayableCards()).does.not.include(card);
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

