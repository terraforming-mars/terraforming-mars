import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {ColonistShuttles} from '../../../src/server/cards/moon/ColonistShuttles';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('ColonistShuttles', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: ColonistShuttles;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new ColonistShuttles();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    MoonExpansion.addColonyTile(player, 'm02');
    MoonExpansion.addColonyTile(player, 'm03');
    MoonExpansion.addColonyTile(player, 'm04');
    MoonExpansion.addColonyTile(player, 'm05');
    MoonExpansion.addColonyTile(player, 'm06');
    MoonExpansion.addColonyTile(player, 'm07');
    MoonExpansion.addColonyTile(player, 'm08');

    player.titanium = 1;
    player.megaCredits = 0;

    expect(player.getTerraformRating()).eq(14);
    expect(moonData.colonyRate).eq(0);

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getTerraformRating()).eq(15);
    expect(moonData.colonyRate).eq(1);
    expect(player.megaCredits).eq(14);
  });
});

