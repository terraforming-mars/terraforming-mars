import {expect} from 'chai';
import {cast, runAllActions} from '../../TestingUtils';
import {RegolithEaters} from '../../../src/server/cards/base/RegolithEaters';
import {Research} from '../../../src/server/cards/base/Research';
import {Tardigrades} from '../../../src/server/cards/base/Tardigrades';
import {ICard} from '../../../src/server/cards/ICard';
import {BactoviralResearch} from '../../../src/server/cards/promo/BactoviralResearch';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {SecurityFleet} from '../../../src/server/cards/base/SecurityFleet';
import {PharmacyUnion} from '../../../src/server/cards/promo/PharmacyUnion';
import {testGame} from '../../TestGame';

describe('BactoviralResearch', () => {
  let card: BactoviralResearch;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BactoviralResearch();
    [game, player] = testGame(2);
  });

  it('Should play with multiple microbe cards', () => {
    const card2 = new Research();
    const card3 = new RegolithEaters();
    const card4 = new Tardigrades();
    player.playedCards.push(card2, card3, card4);

    cast(card.play(player), undefined);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectCard<ICard>);
    action.cb([card3]);
    expect(card3.resourceCount).to.eq(4);
    expect(player.cardsInHand).has.length(1);
  });

  it('Should play with single microbe card', () => {
    const microbeCard = new RegolithEaters();
    player.playedCards.push(microbeCard);
    cast(card.play(player), undefined);

    runAllActions(game);

    expect(microbeCard.resourceCount).to.eq(2);
    expect(player.cardsInHand).has.length(1);
  });

  it('Should play with no microbe cards', () => {
    cast(card.play(player), undefined);
    runAllActions(game);

    expect(player.cardsInHand).has.length(1);
  });

  it('Should ignore non-microbe cards', () => {
    const securityFleetCard = new SecurityFleet();
    player.playedCards.push(securityFleetCard);
    cast(card.play(player), undefined);

    runAllActions(game);

    expect(securityFleetCard.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.length(1);
  });

  it('Should ignore cards with microbe tags but does not collect microbe resources.', () => {
    const pharmacyUnion = new PharmacyUnion();
    player.corporations.push(pharmacyUnion);
    cast(card.play(player), undefined);

    runAllActions(game);

    expect(pharmacyUnion.resourceCount).to.eq(0);
    expect(player.cardsInHand).has.length(1);
  });
});
