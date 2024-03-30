import {IGame} from '../../../src/server/IGame';
import {testGame} from '../../TestGame';
import {MoonData} from '../../../src/server/moon/MoonData';
import {MoonExpansion} from '../../../src/server/moon/MoonExpansion';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {TitaniumMarketMonopolists} from '../../../src/server/cards/moon/TitaniumMarketMonopolists';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';

describe('TitaniumMarketMonopolists', () => {
  let game: IGame;
  let player: TestPlayer;
  let moonData: MoonData;
  let card: TitaniumMarketMonopolists;

  beforeEach(() => {
    [game, player] = testGame(1, {moonExpansion: true});
    moonData = MoonExpansion.moonData(game);
    card = new TitaniumMarketMonopolists();
  });

  it('can play', () => {
    player.cardsInHand = [card];
    player.stock.megacredits = card.cost;

    moonData.miningRate = 3;
    expect(player.getPlayableCardsForTest()).does.include(card);
    moonData.miningRate = 2;
    expect(player.getPlayableCardsForTest()).does.not.include(card);
  });

  it('can act - buy', () => {
    player.stock.megacredits = 1;
    expect(card.canAct(player)).eq(false);

    player.stock.megacredits = 2;
    expect(card.canAct(player)).eq(true);
  });

  it('can act - sell', () => {
    player.stock.titanium = 0;
    expect(card.canAct(player)).eq(false);

    player.stock.titanium = 1;
    expect(card.canAct(player)).eq(true);
  });


  it('sell titanium', () => {
    player.stock.megacredits = 1;
    player.stock.titanium = 2;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(2);
    selectAmount.cb(2);
    expect(player.stock.megacredits).eq(9);
    expect(player.stock.titanium).eq(0);
  });

  it('sell titanium - limited', () => {
    player.stock.megacredits = 0;
    player.stock.titanium = 100;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });

  it('buy titanium', () => {
    player.stock.megacredits = 7;
    player.stock.titanium = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
    selectAmount.cb(2);
    runAllActions(game);
    expect(player.stock.megacredits).eq(3);
    expect(player.stock.titanium).eq(2);
  });

  it('buy titanium - limited', () => {
    player.stock.megacredits = 100;
    player.stock.titanium = 0;
    const selectAmount = cast(card.action(player), SelectAmount);
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });
});

