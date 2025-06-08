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
import {IGame} from '../../../src/server/IGame';
import {Loan} from '../../../src/server/cards/prelude/Loan';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {MetalRichAsteroid} from '../../../src/server/cards/prelude/MetalRichAsteroid';

describe('ValleyTrust', () => {
  let card: ValleyTrust;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ValleyTrust();
    [game, player] = testGame(1, {preludeExtension: true});
  });

  it('Does not get card discount for other tags', () => {
    expect(card.getCardDiscount(player, new Ants())).to.eq(0);
  });

  it('Gets card discount for science tags', () => {
    expect(card.getCardDiscount(player, new MedicalLab())).to.eq(2);
    expect(card.getCardDiscount(player, new Research())).to.eq(4);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });

  it('initial action', () => {
    const loan = new Loan();
    const hugeAsteroid = new HugeAsteroid();
    const metalRichAsteroid = new MetalRichAsteroid();

    game.preludeDeck.drawPile.push(loan, hugeAsteroid, metalRichAsteroid);
    const selectCard = cast(card.initialAction(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).to.have.members([loan, hugeAsteroid, metalRichAsteroid]);

    selectCard.cb([loan]);
    expect(player.playedCards.get(loan.name)).deep.eq(loan);
    expect(game.preludeDeck.discardPile).to.have.members([hugeAsteroid, metalRichAsteroid]);
  });

  it('Card works even without prelude expansion enabled', () => {
    [/* game */, player] = testGame(1, {preludeExtension: false});
    const selectCard = cast(card.initialAction(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).has.length(3);
    expect(selectCard.cards.every((c) => isPreludeCard(c))).is.true;
  });
});
