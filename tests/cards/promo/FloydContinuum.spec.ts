import {expect} from 'chai';
import {FloydContinuum} from '../../../src/server/cards/promo/FloydContinuum';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {maxOutOceans, runAllActions, setOxygenLevel, setTemperature, setVenusScaleLevel} from '../../TestingUtils';
import {IGame} from '../../../src/server/IGame';

describe('FloydContinuum', () => {
  let card: FloydContinuum;
  let game: IGame;
  let player: TestPlayer;

  beforeEach(() => {
    card = new FloydContinuum();
    [game, player] = testGame(1, {venusNextExtension: true});
    player.playedCards = [card];
  });

  it('No global parameters at max', () => {
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);
  });

  it('temperature', () => {
    setTemperature(game, 6);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);

    setTemperature(game, 8);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(3);
  });


  it('oxygen', () => {
    setOxygenLevel(game, 13);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);

    setOxygenLevel(game, 14);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(3);
  });

  it('oceans', () => {
    maxOutOceans(player, 8);
    player.megaCredits = 0; // Erases ocean adjacency bonuses
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);

    maxOutOceans(player, 9);
    player.megaCredits = 0; // Erases ocean adjacency bonuses
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(3);
  });


  it('venus', () => {
    setVenusScaleLevel(game, 28);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(0);

    setVenusScaleLevel(game, 30);
    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(3);
  });


  it('all', () => {
    setVenusScaleLevel(game, 30);
    setOxygenLevel(game, 14);
    maxOutOceans(player, 9);
    setTemperature(game, 8);
    player.megaCredits = 0; // Erases ocean adjacency bonuses

    card.action(player);
    runAllActions(game);

    expect(player.stock.megacredits).eq(12);
  });
});
