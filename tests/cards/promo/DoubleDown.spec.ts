import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {DoubleDown} from '../../../src/server/cards/promo/DoubleDown';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {PowerGeneration} from '../../../src/server/cards/prelude/PowerGeneration';
import {ICard} from '../../../src/server/cards/ICard';
import {Game} from '../../../src/server/Game';
import {cast, runAllActions} from '../../TestingUtils';
import {Arklight} from '../../../src/server/cards/colonies/Arklight';
import {BiosphereSupport} from '../../../src/server/cards/prelude/BiosphereSupport';

describe('DoubleDown', () => {
  let card: DoubleDown;
  let player: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new DoubleDown();
    [game, player] = testGame(1, {preludeExtension: true});
  });

  it('Cannot play as first prelude', () => {
    player.preludeCardsInHand = [card, new Donation()];

    expect(player.canPlay(card)).is.false;
  });

  it('Can play as second prelude', () => {
    const donation = new Donation();
    player.playedCards.push(donation);

    expect(player.canPlay(card)).is.true;

    player.playCard(card);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);

    expect(selectCard.cards).deep.eq([donation]);

    selectCard.cb([donation]);

    expect(player.megaCredits).to.eq(21);
    expect(player.playedCards).to.have.members([donation, card]);
  });

  it('Ignores unplayable preludes', () => {
    const galileanMining = new GalileanMining();
    // Galilean miuning requires you to pay 5MC.
    player.playedCards.push(galileanMining);

    // Cannot afford
    player.megaCredits = 4;
    expect(card.canPlay(player)).is.false;

    // Can afford
    player.megaCredits = 5;
    expect(card.canPlay(player)).is.true;

    player.playCard(card);
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

    player.playCard(card);
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

    player.playCard(card);
    runAllActions(game);
    const selectCard = cast(player.popWaitingFor(), SelectCard<ICard>);
    selectCard.cb([prelude]);
    runAllActions(game);

    expect(corp.resourceCount).eq(1);
  });
});
