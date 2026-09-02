import {expect} from 'chai';
import {cast} from '@/common/utils/utils';
import {Hospitals} from '../../../src/server/cards/promo/Hospitals';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {ICard} from '../../../src/server/cards/ICard';
import {addCity, churn, runAllActions} from '../../TestingUtils';
import {PharmacyUnion} from '../../../src/server/cards/promo/PharmacyUnion';
import {MartianCulture} from '../../../src/server/cards/pathfinders/MartianCulture';

describe('Hospitals', () => {
  let card: Hospitals;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;
  let pharmacy: PharmacyUnion;
  let other: IProjectCard;

  beforeEach(() => {
    card = new Hospitals();
    pharmacy = new PharmacyUnion();
    other = new MartianCulture();
    [game, player, player2] = testGame(2);
  });

  it('Add resources', () => {
    player.playedCards.push(card);
    addCity(player);
    addCity(player);
    expect(card.resourceCount).to.eq(2);
    addCity(player2);
    expect(card.resourceCount).to.eq(3);
  });

  it('Remove resource - this card', () => {
    addCity(player);
    addCity(player);
    addCity(player);
    addCity(player);
    addCity(player);
    addCity(player);
    player2.playedCards.push(pharmacy);
    pharmacy.resourceCount = 12;
    player.playedCards.push(card);
    card.resourceCount = 6;
    const input = card.action(player);
    expect(input).to.be.undefined;
    runAllActions(game);
    expect(card.resourceCount).to.eq(5);
    expect(player.stock.megacredits).to.eq(6);
  });

  it('act - two cards with diseases - select 1st (Pharmacy)', () => {
    player.playedCards.push(pharmacy);
    player.playedCards.push(card, other);
    addCity(player);
    addCity(player);
    pharmacy.resourceCount = 12;
    expect(card.resourceCount).eq(2);
    other.resourceCount = 1;
    const input = churn(card.action(player), player);
    const selectCard = cast(input, SelectCard<ICard>);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([pharmacy]);
    runAllActions(game);
    expect(pharmacy.resourceCount).eq(11);
    expect(player.stock.megacredits).to.eq(2);
    expect(card.resourceCount).eq(2);
  });

  it('act - two cards with 2 diseases - select 2nd (Hospitals)', () => {
    player.playedCards.push(pharmacy);
    player.playedCards.push(card);
    addCity(player);
    addCity(player);
    addCity(player2);
    pharmacy.resourceCount = 12;
    expect(card.resourceCount).eq(3);
    const input = churn(card.action(player), player);
    const selectCard = cast(input, SelectCard<ICard>);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([card]);
    runAllActions(game);
    expect(card.resourceCount).eq(2);
    expect(pharmacy.resourceCount).eq(12);
    expect(player.stock.megacredits).to.eq(3);
  });
});
