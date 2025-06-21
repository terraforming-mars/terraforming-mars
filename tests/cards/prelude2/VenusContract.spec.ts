import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {VenusContract} from '../../../src/server/cards/prelude2/VenusContract';
import {IGame} from '../../../src/server/IGame';
import {Tag} from '../../../src/common/cards/Tag';

describe('VenusContract', () => {
  let card: VenusContract;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new VenusContract();
    [game, player, player2] = testGame(2, {venusNextExtension: true});
    player.playedCards.push(card);
  });

  it('play', () => {
    expect(player.getTerraformRating()).eq(20);
    player.cardsInHand.length = 0;
    player.playedCards.set();

    card.play(player);

    expect(player.getTerraformRating()).eq(21);
    expect(player.cardsInHand).length(1);
    expect(player.cardsInHand[0].tags).includes(Tag.VENUS);
  });

  it('raise 1 step', () => {
    game.increaseVenusScaleLevel(player, 1);
    expect(player.megaCredits).eq(3);
  });

  it('raise 2 steps', () => {
    game.increaseVenusScaleLevel(player, 2);
    expect(player.megaCredits).eq(6);
  });

  it('raise 3 steps', () => {
    game.increaseVenusScaleLevel(player, 3);
    expect(player.megaCredits).eq(9);
  });

  it('raise temperature', () => {
    game.increaseTemperature(player, 2);
    expect(player.megaCredits).eq(0);
  });

  it('other player increases venus', () => {
    game.increaseTemperature(player2, 2);
    expect(player.megaCredits).eq(0);
    expect(player2.megaCredits).eq(0);
  });

  it('negative venus', () => {
    game.increaseVenusScaleLevel(player, -1);
    expect(player.megaCredits).eq(0);
  });
});
