import {expect} from 'chai';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {NewPartner} from '../../../src/server/cards/promo/NewPartner';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {cast, runAllActions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {IPreludeCard, isPreludeCard} from '../../../src/server/cards/prelude/IPreludeCard';

describe('NewPartner', () => {
  let card: NewPartner;
  let player: TestPlayer;
  let game: IGame;
  let smeltingPlant: IPreludeCard;
  let donation: IPreludeCard;
  let hugeAsteroid: IPreludeCard;
  let galileanMining: IPreludeCard;

  beforeEach(() => {
    card = new NewPartner();
    [game, player] = testGame(2, {preludeExtension: true});
    smeltingPlant = new SmeltingPlant();
    donation = new Donation();
    hugeAsteroid = new HugeAsteroid();
    galileanMining = new GalileanMining();
  });

  it('Should play with at least 1 playable prelude', () => {
    game.preludeDeck.drawPile.push(smeltingPlant, donation);

    const selectCard = cast(card.play(player), SelectCard<IPreludeCard>);

    expect(selectCard.cards).deep.eq([donation, smeltingPlant]);
    selectCard.cb([selectCard.cards[0]]);

    expect(player.production.megacredits).to.eq(1);
    expect(player.playedCards.asArray().every((card) => isPreludeCard(card))).is.true;
  });

  it('Can play with no playable preludes drawn', () => {
    player.megaCredits = 0;
    // Both of these cards cost MC which the player does not have, and so
    // if the player plays this they will have to fizzle one of the cards.
    game.preludeDeck.drawPile.push(hugeAsteroid, galileanMining);

    const selectCard = cast(card.play(player), SelectCard<IPreludeCard>);
    expect(selectCard.cards).deep.eq([galileanMining, hugeAsteroid]);
    selectCard.cb([selectCard.cards[0]]);
    runAllActions(game);
    expect(player.megaCredits).eq(15);
  });
});
