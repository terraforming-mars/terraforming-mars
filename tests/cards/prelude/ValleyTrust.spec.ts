import {SelectCard} from '../../../src/inputs/SelectCard';
import {expect} from 'chai';
import {TestingUtils} from '../../TestingUtils';
import {Ants} from '../../../src/cards/base/Ants';
import {MedicalLab} from '../../../src/cards/base/MedicalLab';
import {Research} from '../../../src/cards/base/Research';
import {ValleyTrust} from '../../../src/cards/prelude/ValleyTrust';
import {TestPlayer} from '../../TestPlayer';
import {CardType} from '../../../src/common/cards/CardType';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('ValleyTrust', function() {
  let card : ValleyTrust;
  let player : TestPlayer;

  beforeEach(function() {
    card = new ValleyTrust();
    const game = newTestGame(1, {preludeExtension: true});
    player = getTestPlayer(game, 0);
  });

  it('Does not get card discount for other tags', function() {
    expect(card.getCardDiscount(player, new Ants())).to.eq(0);
  });

  it('Gets card discount for science tags', function() {
    expect(card.getCardDiscount(player, new MedicalLab())).to.eq(2);
    expect(card.getCardDiscount(player, new Research())).to.eq(4);
  });

  it('Should play', function() {
    const action = card.play();
    expect(action).is.undefined;
  });

  it('initial action', () => {
    const selectCard = TestingUtils.cast(card.initialAction(player), SelectCard);
    expect(selectCard.cards).has.length(3);
    expect(selectCard.cards.filter((c) => c.cardType === CardType.PRELUDE)).has.length(3);
  });

  it('Card works even without prelude', () => {
    const game = newTestGame(1, {preludeExtension: false});
    const player = getTestPlayer(game, 0);
    const selectCard = TestingUtils.cast(card.initialAction(player), SelectCard);
    expect(selectCard.cards).has.length(3);
    expect(selectCard.cards.filter((c) => c.cardType === CardType.PRELUDE)).has.length(3);
  });
});
