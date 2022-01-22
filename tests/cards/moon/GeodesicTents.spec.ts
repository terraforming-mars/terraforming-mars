import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TestPlayer} from '../../TestPlayer';
import {GeodesicTents} from '../../../src/cards/moon/GeodesicTents';
import {expect} from 'chai';
import {Resources} from '../../../src/common/Resources';
import {PlaceMoonColonyTile} from '../../../src/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('GeodesicTents', () => {
  let player: TestPlayer;
  let card: GeodesicTents;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new GeodesicTents();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.setProductionForTest({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.setProductionForTest({energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.setProductionForTest({energy: 1});

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    expect(player.getProduction(Resources.PLANTS)).eq(1);

    expect(player.game.deferredActions.peek()!).is.instanceOf(PlaceMoonColonyTile);
  });
});

