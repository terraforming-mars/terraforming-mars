import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SteelMarketMonopolists} from '../../../src/server/cards/moon/SteelMarketMonopolists';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('SteelMarketMonopolists', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: SteelMarketMonopolists;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
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

  it('sell steel', () => {
    player.megaCredits = 1;
    player.steel = 2;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(2);
    selectAmount.cb(2);
    expect(player.megaCredits).eq(7);
    expect(player.steel).eq(0);
  });

  it('sell steel - limited', () => {
    player.megaCredits = 0;
    player.steel = 100;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
  });

  it('buy steel', () => {
    player.megaCredits = 7;
    player.steel = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(2);
    selectAmount.cb(2);
    runAllActions(game);
    expect(player.megaCredits).eq(1);
    expect(player.steel).eq(4);
  });

  it('buy steel - limited', () => {
    player.megaCredits = 100;
    player.steel = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
  });
});

