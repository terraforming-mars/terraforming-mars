import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, setPlayerProductionForTest, TestPlayers} from '../../TestingUtils';
import {HeliostatMirrorArray} from '../../../src/cards/moon/HeliostatMirrorArray';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('HeliostatMirrorArray', () => {
  let player: Player;
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
    setPlayerProductionForTest(player, {energy: 0});
    player.titanium = 1;
    player.heat = 0;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.heat).eq(1);
    expect(player.getProduction(Resources.ENERGY)).eq(2);
  });
});

