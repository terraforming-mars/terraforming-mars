import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {SphereHabitats} from '../../../src/cards/moon/SphereHabitats';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('SphereHabitats', () => {
  let player: Player;
  let card: SphereHabitats;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    expect(player.getProduction(Resources.STEEL)).eq(0);
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

