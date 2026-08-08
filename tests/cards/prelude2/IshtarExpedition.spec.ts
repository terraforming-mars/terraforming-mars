import {expect} from 'chai';
import {IshtarExpedition} from '@/server/cards/prelude2/IshtarExpedition';
import {Tag} from '@/common/cards/Tag';
import {IGame} from '@/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setVenusScaleLevel} from '../../TestingUtils';

describe('IshtarExpedition', () => {
  let card: IshtarExpedition;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new IshtarExpedition();
    [game, player] = testGame(2, {venusNextExtension: true});
  });

  it('canPlay', () => {
    setVenusScaleLevel(game, 8);
    expect(card.canPlay(player)).is.false;

    setVenusScaleLevel(game, 10);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    setVenusScaleLevel(game, 10);
    card.play(player);

    expect(player.stock.titanium).to.eq(3);
    expect(player.cardsInHand).has.lengthOf(2);
    expect(player.cardsInHand[0].tags).includes(Tag.VENUS);
    expect(player.cardsInHand[1].tags).includes(Tag.VENUS);
  });
});
