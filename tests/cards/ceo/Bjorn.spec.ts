import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {forceGenerationEnd} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Bjorn} from '../../../src/server/cards/ceos/Bjorn';
import {LawSuit} from '../../../src/server/cards/promo/LawSuit';

describe('Bjorn', () => {
  let card: Bjorn;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let player4: TestPlayer;
  let game: IGame;
  let stealValue: number;

  beforeEach(() => {
    card = new Bjorn();
    [game, player, player2, player3, player4] = testGame(4, {ceoExtension: true});
    game.generation = 10;
    stealValue = game.generation + 2;
  });

  it('Can only act once per game', () => {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });

  it('Takes OPG action, Everyone is richer than me, and has more MC than Current Generation+2.  Steal the maximum amount of MC', () => {
    player.megaCredits = 10;
    player2.megaCredits = 20;
    player3.megaCredits = 30;
    player4.megaCredits = 40;
    card.action(player);
    expect(player.megaCredits).eq(10 + 3*stealValue);
    expect(player2.megaCredits).eq(20-stealValue);
    expect(player3.megaCredits).eq(30-stealValue);
    expect(player4.megaCredits).eq(40-stealValue);
  });

  it('Takes OPG action, two players have more money than me and one has less', () => {
    player.megaCredits = 10;
    player2.megaCredits = 0;
    player3.megaCredits = 30;
    player4.megaCredits = 40;
    card.action(player);
    expect(player.megaCredits).eq(10 + 2*stealValue);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(30-stealValue);
    expect(player4.megaCredits).eq(40-stealValue);
  });

  it('Takes OPG action, First player has plenty of MC, Second player has more MC than me but _less than the current generation_, third player is broke', () => {
    player.megaCredits = 5;
    player2.megaCredits = 40; // Steal stealValue from this player
    player3.megaCredits = 7; // Steal 7 (everything) from this player
    player4.megaCredits = 3; // Steal nothing from this player
    card.action(player);
    expect(player.megaCredits).eq(5 + stealValue + 7);
    expect(player2.megaCredits).eq(40 - stealValue);
    expect(player3.megaCredits).eq(0);
    expect(player4.megaCredits).eq(3);
  });

  it('Takes OPG action, Everybody has more money than me, but less than current generation, steal as much as possible', () => {
    player.megaCredits = 0;
    player2.megaCredits = 5;
    player3.megaCredits = 5;
    player4.megaCredits = 5;
    card.action(player);
    expect(player.megaCredits).eq(15);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(0);
    expect(player4.megaCredits).eq(0);
  });

  it('Takes OPG action, but nobody has more money than me.', () => {
    player.megaCredits = 10;
    player2.megaCredits = 2;
    player3.megaCredits = 3;
    player4.megaCredits = 4;
    card.action(player);
    expect(player.megaCredits).eq(10);
    expect(player2.megaCredits).eq(2);
    expect(player3.megaCredits).eq(3);
    expect(player4.megaCredits).eq(4);
  });

  it('Takes OPG action, players that lost money can play Law Suit', () => {
    player.megaCredits = 5;
    player2.megaCredits = 50;
    player3.megaCredits = 0;
    player4.megaCredits = 7;

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
