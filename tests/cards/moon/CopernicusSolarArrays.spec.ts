import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {CopernicusSolarArrays} from '../../../src/cards/moon/CopernicusSolarArrays';
import {expect} from 'chai';
import {Resources} from '../../../src/Resources';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('CopernicusSolarArrays', () => {
  let player: Player;
  let card: CopernicusSolarArrays;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('id', [player], player, MOON_OPTIONS);
    card = new CopernicusSolarArrays();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    player.titanium = 1;
    expect(player.getPlayableCards()).does.include(card);

    player.titanium = 0;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('play', () => {
    player.titanium = 1;
    player.heat = 0;

    card.play(player);

    expect(player.titanium).eq(0);
    expect(player.heat).eq(2);
    expect(player.getProduction(Resources.ENERGY)).eq(1);
  });
});
