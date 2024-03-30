import {expect} from 'chai';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Bjorn} from '../../../src/server/cards/ceos/Bjorn';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';


describe('Bjorn', function() {
  let card: Bjorn;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let player4: TestPlayer;
  let game: Game;
  let stealValue: number;

  beforeEach(() => {
    card = new Bjorn();
    [game, player, player2, player3, player4] = testGame(4, {ceoExtension: true});
    game.generation = 10;
    stealValue = game.generation + 2;
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action, Everyone is richer than me, and has more MC than Current Generation+2.  Steal the maximum amount of MC', function() {
    player.stock.megacredits = 10;
    player2.stock.megacredits = 20;
    player3.stock.megacredits = 30;
    player4.stock.megacredits = 40;
    card.action(player);
    expect(player.stock.megacredits).eq(10 + 3*stealValue);
    expect(player2.stock.megacredits).eq(20-stealValue);
    expect(player3.stock.megacredits).eq(30-stealValue);
    expect(player4.stock.megacredits).eq(40-stealValue);
  });

  it('Takes OPG action, two players have more money than me and one has less', function() {
    player.stock.megacredits = 10;
    player2.stock.megacredits = 0;
    player3.stock.megacredits = 30;
    player4.stock.megacredits = 40;
    card.action(player);
    expect(player.stock.megacredits).eq(10 + 2*stealValue);
    expect(player2.stock.megacredits).eq(0);
    expect(player3.stock.megacredits).eq(30-stealValue);
    expect(player4.stock.megacredits).eq(40-stealValue);
  });

  it('Takes OPG action, First player has plenty of MC, Second player has more MC than me but _less than the current generation_, third player is broke', function() {
    player.stock.megacredits = 5;
    player2.stock.megacredits = 40; // Steal stealValue from this player
    player3.stock.megacredits = 7; // Steal 7 (everything) from this player
    player4.stock.megacredits = 3; // Steal nothing from this player
    card.action(player);
    expect(player.stock.megacredits).eq(5 + stealValue + 7);
    expect(player2.stock.megacredits).eq(40 - stealValue);
    expect(player3.stock.megacredits).eq(0);
    expect(player4.stock.megacredits).eq(3);
  });

  it('Takes OPG action, Everybody has more money than me, but less than current generation, steal as much as possible', function() {
    player.stock.megacredits = 0;
    player2.stock.megacredits = 5;
    player3.stock.megacredits = 5;
    player4.stock.megacredits = 5;
    card.action(player);
    expect(player.stock.megacredits).eq(15);
    expect(player2.stock.megacredits).eq(0);
    expect(player3.stock.megacredits).eq(0);
    expect(player4.stock.megacredits).eq(0);
  });

  it('Takes OPG action, but nobody has more money than me.', function() {
    player.stock.megacredits = 10;
    player2.stock.megacredits = 2;
    player3.stock.megacredits = 3;
    player4.stock.megacredits = 4;
    card.action(player);
    expect(player.stock.megacredits).eq(10);
    expect(player2.stock.megacredits).eq(2);
    expect(player3.stock.megacredits).eq(3);
    expect(player4.stock.megacredits).eq(4);
  });

  it('Takes OPG action, players that lost money can play Law Suit', () => {
    player.stock.megacredits = 5;
    player2.stock.megacredits = 50;
    player3.stock.megacredits = 0;
    player4.stock.megacredits = 7;

    const lawsuit = new LawSuit();
    expect(lawsuit.canPlay(player)).is.not.true;
    expect(lawsuit.canPlay(player2)).is.not.true;
    expect(lawsuit.canPlay(player3)).is.not.true;
    expect(lawsuit.canPlay(player4)).is.not.true;

    card.action(player);
    expect(lawsuit.canPlay(player)).is.not.true;
    expect(lawsuit.canPlay(player2)).is.true;
    expect(lawsuit.canPlay(player3)).is.not.true;
    expect(lawsuit.canPlay(player4)).is.true;
  });
});
