import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {GeodesicTents} from '../../../src/server/cards/moon/GeodesicTents';
import {PlaceMoonColonyTile} from '../../../src/server/moon/PlaceMoonColonyTile';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('GeodesicTents', () => {
  let player: TestPlayer;
  let card: GeodesicTents;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, MOON_OPTIONS);
    card = new GeodesicTents();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 0;
    player.production.override({energy: 1});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.production.override({energy: 0});
    expect(player.getPlayableCards()).does.not.include(card);

    player.titanium = 1;
    player.production.override({energy: 1});
    expect(player.getPlayableCards()).does.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.production.override({energy: 1});

    player.simplePlay(card);

    expect(player.titanium).eq(0);
    expect(player.production.energy).eq(0);
    expect(player.production.plants).eq(1);

    expect(player.game.deferredActions.peek()!).is.instanceOf(PlaceMoonColonyTile);
  });
});

