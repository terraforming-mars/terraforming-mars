import {Game} from '../../../src/Game';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {HeliostatMirrorArray} from '../../../src/cards/moon/HeliostatMirrorArray';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';
import {TestPlayer} from '../../TestPlayer';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('HeliostatMirrorArray', () => {
  let player: TestPlayer;
  let card: HeliostatMirrorArray;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new HeliostatMirrorArray();
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
    player.setProductionForTest({energy: 0});
    player.titanium = 1;
    player.heat = 0;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.heat).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});

