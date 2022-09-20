import {expect} from 'chai';
import {CardType} from '../../../src/common/cards/CardType';
import {CardName} from '../../../src/common/cards/CardName';
import {Donation} from '../../../src/server/cards/prelude/Donation';
import {GalileanMining} from '../../../src/server/cards/prelude/GalileanMining';
import {HugeAsteroid} from '../../../src/server/cards/prelude/HugeAsteroid';
import {NewPartner} from '../../../src/server/cards/promo/NewPartner';
import {SmeltingPlant} from '../../../src/server/cards/prelude/SmeltingPlant';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {cast, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';

describe('NewPartner', function() {
  let card: NewPartner;
  let player: Player;
  let game: Game;

  beforeEach(() => {
    card = new NewPartner();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();

    game = Game.newInstance('gameid', [player, redPlayer], player, testGameOptions({preludeExtension: true}));
  });

  it('Should play with at least 1 playable prelude', function() {
    game.preludeDeck.drawPile.push(new SmeltingPlant(), new Donation());

    const selectCard = cast(card.play(player), SelectCard);
    expect(selectCard.cards).has.length(2);
    selectCard.cb([selectCard.cards[0]]);
    expect(player.production.megacredits).to.eq(1);
    expect(player.playedCards.every((card) => card.cardType === CardType.PRELUDE)).is.true;
  });

  it('Should play with only 1 playable prelude', function() {
    // In this test, only one card is playable. play() should still return SelectCard with
    // the one card, so the player sees their option.
    game.preludeDeck.drawPile.push(new HugeAsteroid(), new Donation());

    const selectCard = cast(card.play(player), SelectCard);
    expect(selectCard.cards).has.length(1);
    expect(selectCard.cards[0].name).eq(CardName.DONATION);
  });

  it('Can play with no playable preludes drawn', function() {
    player.megaCredits = 0;
    // Both of these cards cost MC which the player does not have, and so
    // if the player plays this they just get the MC production.
    game.preludeDeck.drawPile.push(new HugeAsteroid(), new GalileanMining());

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.production.megacredits).to.eq(1);
  });
});
