import {expect} from 'chai';
import {CardType} from '../../../src/common/cards/CardType';
import {CardName} from '../../../src/common/cards/CardName';
import {Donation} from '../../../src/cards/prelude/Donation';
import {GalileanMining} from '../../../src/cards/prelude/GalileanMining';
import {HugeAsteroid} from '../../../src/cards/prelude/HugeAsteroid';
import {NewPartner} from '../../../src/cards/promo/NewPartner';
import {SmeltingPlant} from '../../../src/cards/prelude/SmeltingPlant';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/common/Resources';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';

describe('NewPartner', function() {
  let card : NewPartner; let player : Player; let game : Game;

  beforeEach(() => {
    card = new NewPartner();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();

    const gameOptions = TestingUtils.setCustomGameOptions({preludeExtension: true});
    game = Game.newInstance('foobar', [player, redPlayer], player, gameOptions);
  });

  it('Should play with at least 1 playable prelude', function() {
    game.dealer.preludeDeck.push(new SmeltingPlant(), new Donation());

    const selectCard = TestingUtils.cast(card.play(player), SelectCard);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
    expect(player.playedCards.every((card) => card.cardType === CardType.PRELUDE)).is.true;
  });

  it('Should play with only 1 playable prelude', function() {
    // In this test, only one card is playable. play() should still return SelectCard with
    // the one card, so the player sees their option.
    game.dealer.preludeDeck.push(new HugeAsteroid(), new Donation());

    const selectCard = TestingUtils.cast(card.play(player), SelectCard);
    expect(selectCard.cards).has.length(1);
    expect(selectCard.cards[0].name).eq(CardName.DONATION);
  });

  it('Can play with no playable preludes drawn', function() {
    player.megaCredits = 0;
    // Both of these cards cost MC which the player does not have, and so
    // if the player plays this they just get the MC production.
    game.dealer.preludeDeck.push(new HugeAsteroid(), new GalileanMining());

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
