import {expect} from 'chai';
import {Supermarkets} from '../../../src/server/cards/promo/Supermarkets';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Supermarkets', () => {
  let card: Supermarkets;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Supermarkets();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    const lands = game.board.getAvailableSpacesOnLand(player);
    game.addCity(player, lands[0]);
    expect(card.canPlay(player)).is.not.true;
    game.addCity(player, lands[1]);
    expect(card.canPlay(player)).is.true;

    card.play(player);

    expect(player.production.megacredits).to.eq(2);
    expect(card.getVictoryPoints(player)).to.eq(1);
  });
});
