import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {expect} from 'chai';
import {cast} from '../../TestingUtils';
import {Ants} from '../../../src/server/cards/base/Ants';
import {MedicalLab} from '../../../src/server/cards/base/MedicalLab';
import {Research} from '../../../src/server/cards/base/Research';
import {ValleyTrust} from '../../../src/server/cards/prelude/ValleyTrust';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IPreludeCard, isPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';

describe('ValleyTrust', function() {
  let card: ValleyTrust;
  let player: TestPlayer;

  beforeEach(function() {
    card = new ValleyTrust();
    [/* game */, player] = testGame(1, {preludeExtension: true});
  });

  it('Does not get card discount for other tags', function() {
    expect(card.getCardDiscount(player, new Ants())).to.eq(0);
  });

  it('Gets card discount for science tags', function() {
    expect(card.getCardDiscount(player, new MedicalLab())).to.eq(2);
    expect(card.getCardDiscount(player, new Research())).to.eq(4);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('initial action', () => {
    const selectCard = cast(card.initialAction(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).has.length(3);
    expect(selectCard.cards.every((c) => isPreludeCard(c))).is.true;
  });

  it('Card works even without prelude expansion enabled', () => {
    [/* game */, player] = testGame(1, {preludeExtension: false});
    const selectCard = cast(card.initialAction(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).has.length(3);
    expect(selectCard.cards.every((c) => isPreludeCard(c))).is.true;
  });
});
