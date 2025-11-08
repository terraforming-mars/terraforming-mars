import {expect} from 'chai';
import {Steelworks} from '../../../src/server/cards/base/Steelworks';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';

describe('Steelworks', () => {
  let card: Steelworks;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Steelworks();
    [game, player] = testGame(2);
  });

  it('Can not act', () => {
    player.energy = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should act', () => {
    player.energy = 4;
    expect(card.canAct(player)).is.true;

    card.action(player);
    expect(player.energy).to.eq(0);
    expect(player.steel).to.eq(2);
    expect(game.getOxygenLevel()).to.eq(1);
  });
});
