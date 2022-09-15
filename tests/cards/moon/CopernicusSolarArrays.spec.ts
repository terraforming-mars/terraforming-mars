import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {CopernicusSolarArrays} from '../../../src/server/cards/moon/CopernicusSolarArrays';
import {expect} from 'chai';

describe('CopernicusSolarArrays', () => {
  let player: Player;
  let card: CopernicusSolarArrays;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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
    expect(player.production.energy).eq(1);
  });
});
