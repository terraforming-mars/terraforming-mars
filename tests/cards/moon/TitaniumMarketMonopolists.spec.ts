import {Game} from '../../../src/server/Game';
import {IMoonData} from '../../../src/server/moon/IMoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {Player} from '../../../src/server/Player';
import {cast, runAllActions, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TitaniumMarketMonopolists} from '../../../src/server/cards/moon/TitaniumMarketMonopolists';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('TitaniumMarketMonopolists', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: TitaniumMarketMonopolists;

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({moonExpansion: true}));
    moonData = MoonExpansion.moonData(game);
    card = new TitaniumMarketMonopolists();
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
    player.megaCredits = 1;
    expect(card.canAct(player)).eq(false);

    player.megaCredits = 2;
    expect(card.canAct(player)).eq(true);
  });

  it('can act - sell', () => {
    player.titanium = 0;
    expect(card.canAct(player)).eq(false);

    player.titanium = 1;
    expect(card.canAct(player)).eq(true);
  });


  it('sell titanium', () => {
    player.megaCredits = 1;
    player.titanium = 2;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(2);
    selectAmount.cb(2);
    expect(player.megaCredits).eq(9);
    expect(player.titanium).eq(0);
  });

  it('sell titanium - limited', () => {
    player.megaCredits = 0;
    player.titanium = 100;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });

  it('buy titanium', () => {
    player.megaCredits = 7;
    player.titanium = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
    selectAmount.cb(2);
    runAllActions(game);
    expect(player.megaCredits).eq(3);
    expect(player.titanium).eq(2);
  });

  it('buy titanium - limited', () => {
    player.megaCredits = 100;
    player.titanium = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });
});

