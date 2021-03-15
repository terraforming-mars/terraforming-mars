import {Game} from '../../../src/Game';
import {IMoonData} from '../../../src/moon/IMoonData';
import {MoonExpansion} from '../../../src/moon/MoonExpansion';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {TitaniumMarketMonopolists} from '../../../src/cards/moon/TitaniumMarketMonopolists';
import {expect} from 'chai';
import {SelectAmount} from '../../../src/inputs/SelectAmount';

const MOON_OPTIONS = TestingUtils.setCustomGameOptions({moonExpansion: true});

describe('TitaniumMarketMonopolists', () => {
  let game: Game;
  let player: Player;
  let moonData: IMoonData;
  let card: TitaniumMarketMonopolists;

  beforeEach(() => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('id', [player], player, MOON_OPTIONS);
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
    const action = card.action(player);
    expect(action).is.instanceof(SelectAmount);
    const selectAmount = action as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(2);
    selectAmount.cb(2);
    expect(player.megaCredits).eq(9);
    expect(player.titanium).eq(0);
  });

  it('sell titanium - limited', () => {
    player.megaCredits = 0;
    player.titanium = 100;
    const action = card.action(player);
    expect(action).is.instanceof(SelectAmount);
    const selectAmount = action as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });

  it('buy titanium', () => {
    player.megaCredits = 7;
    player.titanium = 0;
    const action = card.action(player);
    expect(action).is.instanceof(SelectAmount);
    const selectAmount = action as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(3);
    selectAmount.cb(2);
    expect(player.megaCredits).eq(3);
    expect(player.titanium).eq(2);
  });

  it('buy titanium - limited', () => {
    player.megaCredits = 100;
    player.titanium = 0;
    const action = card.action(player);
    expect(action).is.instanceof(SelectAmount);
    const selectAmount = action as SelectAmount;
    expect(selectAmount.min).eq(1);
    expect(selectAmount.max).eq(4);
  });
});

