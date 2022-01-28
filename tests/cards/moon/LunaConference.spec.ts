import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {LunaConference} from '../../../src/cards/moon/LunaConference';
import {expect} from 'chai';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {IMoonData} from '../../../src/moon/IMoonData';
import {TileType} from '../../../src/common/TileType';
import {Scientists} from '../../../src/turmoil/parties/Scientists';
import {Greens} from '../../../src/turmoil/parties/Greens';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('LunaConference', () => {
  let player: Player;
  let game: Game;
  let card: LunaConference;
  let moonData: IMoonData;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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

    spaces[0].tile = {tileType: TileType.MOON_COLONY};
    spaces[1].tile = {tileType: TileType.MOON_COLONY};
    spaces[2].tile = {tileType: TileType.MOON_COLONY};

    player.megaCredits = 0;
    card.play(player);

    expect(player.megaCredits).eq(6);
  });
});

