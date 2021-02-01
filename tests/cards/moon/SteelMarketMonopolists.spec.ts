import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';
import {SteelMarketMonopolists} from '../../../src/cards/moon/SteelMarketMonopolists';
import {expect} from 'chai';

const MOON_OPTIONS = setCustomGameOptions({moonExpansion: true});

describe('SteelMarketMonopolists', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: SteelMarketMonopolists;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
    moonData = MoonExpansion.moonData(game);
    card = new SteelMarketMonopolists();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.megaCredits = card.cost;

    moonData.miningRate = 3;
    expect(player.getPlayableCards()).does.include(card);
    moonData.miningRate = 2;
    expect(player.getPlayableCards()).does.not.include(card);
  });

  it('can act - buy', () => {
    player.megaCredits = 2;
    expect(card.canAct(player)).eq(false);

    player.megaCredits = 3;
    expect(card.canAct(player)).eq(true);
  });

  it('can act - sell', () => {
    player.steel = 0;
    expect(card.canAct(player)).eq(false);

    player.steel = 1;
    expect(card.canAct(player)).eq(true);
  });

  // TODO(kberg): action tests, which are tricky.
});

