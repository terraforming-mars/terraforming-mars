import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {expect} from 'chai';
import {EccentricSponsor} from '../../../src/server/cards/prelude/EccentricSponsor';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {NitrogenRichAsteroid} from '../../../src/server/cards/base/NitrogenRichAsteroid';

describe('EccentricSponsor', function() {
  let card: EccentricSponsor;
  let player: TestPlayer;

  beforeEach(function() {
    card = new EccentricSponsor();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
  });

  it('Gets card discount', function() {
    expect(card.getCardDiscount(player)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getCardDiscount(player)).to.eq(25);
  });

  it('Should play', function() {
    const nitrogenRichAsteroid = new NitrogenRichAsteroid();
    player.cardsInHand = [nitrogenRichAsteroid];
    player.megaCredits = 6;

    expect(player.getCardCost(nitrogenRichAsteroid)).eq(31);
    expect(player.canPlay(nitrogenRichAsteroid)).is.false;

    player.playCard(card);
    runAllActions(player.game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).deep.eq([nitrogenRichAsteroid]);

    expect(player.getCardCost(nitrogenRichAsteroid)).eq(6);
    expect(player.canPlay(nitrogenRichAsteroid)).is.true;
  });
});
