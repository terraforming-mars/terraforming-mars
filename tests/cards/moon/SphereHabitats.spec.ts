import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SphereHabitats} from '../../../src/server/cards/moon/SphereHabitats';
import {expect} from 'chai';
import {PlaceMoonColonyTile} from '../../../src/server/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SphereHabitats', () => {
  let player: Player;
  let card: SphereHabitats;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new SphereHabitats();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.titanium = 0;
    player.megaCredits = card.cost;
    expect(player.getPlayableCards()).does.not.include(card);
    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 3;
    expect(player.production.steel).eq(0);
    expect(player.getTerraformRating()).eq(14);

    card.play(player);

    expect(player.titanium).eq(2);
    // PlaceMoonColonyTile is what's responsible for raising the colony rate.
    // Currently that path is already tested with existing code.
    // So I won't keep repeating it.
    // That said, PlaceMoonRoadTile could have its own test. :D
    expect(player.game.deferredActions.peek()).instanceOf(PlaceMoonColonyTile);
  });
});

