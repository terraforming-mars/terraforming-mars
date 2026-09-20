import {expect} from 'chai';
import {HomeostasisBureau} from '@/server/cards/promo/HomeostasisBureau';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setTemperature} from '../../TestingUtils';

describe('HomeostasisBureau', () => {
  let card: HomeostasisBureau;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HomeostasisBureau();
    [game, player, player2] = testGame(2);
    setTemperature(game, 4);
  });

  it('play', () => {
    card.play(player);
    expect(player.production.heat).to.eq(2);
  });

  it('Gains 3 M€ when the temperature is raised by 1 step', () => {
    player.playedCards.push(card);
    game.increaseTemperature(player, 1);
    expect(player.megaCredits).to.eq(3);
  });

  it('Gains 3 M€ per step when the temperature is raised multiple steps at once', () => {
    player.playedCards.push(card);
    game.increaseTemperature(player, 2);
    expect(player.megaCredits).to.eq(6);
  });

  it('Does not gain M€ when oxygen is raised', () => {
    player.playedCards.push(card);
    game.increaseOxygenLevel(player, 1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Only gains M€ when the card owner is credited with raising the temperature', () => {
    player.playedCards.push(card);
    game.increaseTemperature(player2, 1);
    expect(player.megaCredits).to.eq(0);
  });
});
