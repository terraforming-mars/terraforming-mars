import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {DoubleDown} from '../../../src/server/cards/promo/DoubleDown';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {PowerGeneration} from '../../../src/server/cards/prelude/PowerGeneration';
import {ICard} from '../../../src/server/cards/ICard';
import {IGame} from '../../../src/server/IGame';
import {cast, runAllActions} from '../../TestingUtils';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {BiosphereSupport} from '../../../src/server/cards/prelude/BiosphereSupport';
import {NewPartner} from '../../../src/server/cards/promo/NewPartner';

describe('DoubleDown', () => {
  let doubleDown: DoubleDown;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    doubleDown = new DoubleDown();
    [game, player] = testGame(1, {preludeExtension: true});
  });

  it('Cannot play as first prelude', () => {
    player.preludeCardsInHand = [doubleDown, new Donation()];

    expect(player.canPlay(doubleDown)).is.false;
  });

  it('Can play as second prelude', () => {
    const donation = new Donation();
    player.playedCards.push(donation);
    player.preludeCardsInHand.push(doubleDown);

    expect(player.canPlay(doubleDown)).is.true;

    player.playCard(doubleDown);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);

    expect(selectCard.cards).deep.eq([donation]);

    selectCard.cb([donation]);

    expect(player.stock.megacredits).to.eq(21);
    expect(player.playedCards).to.have.members([donation, doubleDown]);
    expect(player.preludeCardsInHand).is.empty;
  });

  it('Ignores unplayable preludes', () => {
    const galileanMining = new GalileanMining();
    // Galilean mining requires you to pay 5MC.
    player.playedCards.push(galileanMining);

    // Cannot afford
    player.stock.megacredits = 4;
    expect(doubleDown.canPlay(player)).is.false;

    // Can afford
    player.stock.megacredits = 5;
    expect(doubleDown.canPlay(player)).is.true;

    player.playCard(doubleDown);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    expect(selectCard.cards).deep.eq([galileanMining]);

    selectCard.cb([galileanMining]);
    expect(player.production.titanium).to.eq(2);
  });

  it('Works with multiple played preludes', () => {
    const donation = new Donation();
    const powerGeneration = new PowerGeneration();
    player.playedCards.push(donation, powerGeneration);

    player.playCard(doubleDown);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCard.cb([powerGeneration]);
    runAllActions(game);
    expect(player.production.energy).to.eq(3);
  });

  it('Does not count tags of copied prelude', () => {
    // When a plant or animal tag is played, add one resource to thi9s card.
    const corp = new Arklight();
    player.corporations.push(corp);

    expect(corp.resourceCount).eq(0);

    // Contains a plant tag.
    const prelude = new BiosphereSupport();
    player.playCard(prelude);
    runAllActions(game);
    expect(corp.resourceCount).eq(1);

    player.playCard(doubleDown);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCard.cb([prelude]);
    runAllActions(game);

    expect(corp.resourceCount).eq(1);
  });

  it('Fizzles when there are no playable preludes.', () => {
    const galileanMining = new GalileanMining();
    // Galilean mining requires you to pay 5MC.
    player.playedCards.push(galileanMining);
    player.preludeCardsInHand.push(doubleDown);

    // Cannot afford
    player.stock.megacredits = 4;
    expect(doubleDown.canPlay(player)).is.false;

    player.playCard(doubleDown);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.production.energy).to.eq(0);
    expect(player.preludeCardsInHand).is.empty;
    expect(player.stock.megacredits).eq(19);
    expect(player.playedCards).deep.eq([galileanMining]);
  });

  it('Can double-down New Partner', () => {
    const newPartner = new NewPartner();
    // Gains 1 MC production, and draw 2 cards.
    player.playedCards.push(newPartner);
    player.preludeCardsInHand.push(doubleDown);

    expect(doubleDown.canPlay(player)).is.true;

    player.playCard(doubleDown);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard);
    selectCard.cb([newPartner]);

    expect(player.production.megacredits).to.eq(1);
    expect(player.preludeCardsInHand).is.empty;
    expect(player.playedCards).deep.eq([newPartner, doubleDown]);
  });

  it('Can double-down when drawing with New Partner', () => {
    const newPartner = new NewPartner();
    game.preludeDeck.drawPile.push(doubleDown);
    player.preludeCardsInHand.push(newPartner);

    player.playCard(newPartner);
    runAllActions(game);

    expect(player.production.megacredits).to.eq(1);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).includes(doubleDown);
    expect(doubleDown.warnings.has('preludeFizzle')).is.false;
    selectCard.cb([doubleDown]);
    runAllActions(game);
    const selectPrelude = cast(player.popWaitingFor(), SelectCard);
    expect(selectPrelude.cards).contains(newPartner);
    selectPrelude.cb([newPartner]);

    expect(player.production.megacredits).to.eq(2);
    expect(player.preludeCardsInHand).is.empty;
    expect(player.playedCards).deep.eq([newPartner, doubleDown]);
  });
});
