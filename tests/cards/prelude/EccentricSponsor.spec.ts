import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';
import {expect} from 'chai';
import {EccentricSponsor} from '../../../src/server/cards/prelude/EccentricSponsor';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {NitrogenRichAsteroid} from '../../../src/server/cards/base/NitrogenRichAsteroid';
import {testGame} from '../../TestGame';

describe('EccentricSponsor', function() {
  let eccentricSponsor: EccentricSponsor;
  let player: TestPlayer;

  beforeEach(function() {
    eccentricSponsor = new EccentricSponsor();
    [/* game */, player] = testGame(1);
  });

  it('Gets card discount', function() {
    expect(eccentricSponsor.getCardDiscount(player)).to.eq(0);
    player.lastCardPlayed = eccentricSponsor.name;
    expect(eccentricSponsor.getCardDiscount(player)).to.eq(25);
  });

  it('Should play', function() {
    const nitrogenRichAsteroid = new NitrogenRichAsteroid();
    player.cardsInHand = [nitrogenRichAsteroid];
    player.megaCredits = 6;

    expect(player.getCardCost(nitrogenRichAsteroid)).eq(31);
    expect(player.canPlay(nitrogenRichAsteroid)).is.false;

    player.playCard(eccentricSponsor);
    runAllActions(player.game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).deep.eq([nitrogenRichAsteroid]);

    expect(player.getCardCost(nitrogenRichAsteroid)).eq(6);
    expect(player.canPlay(nitrogenRichAsteroid)).is.true;
  });

  it('Fizzle', function() {
    const nitrogenRichAsteroid = new NitrogenRichAsteroid();
    player.cardsInHand = [nitrogenRichAsteroid];
    player.megaCredits = 0;

    expect(player.getCardCost(nitrogenRichAsteroid)).eq(31);
    expect(player.canPlay(nitrogenRichAsteroid)).is.false;

    player.playCard(eccentricSponsor);
    runAllActions(player.game);
    cast(player.popWaitingFor(), undefined);
    expect(player.megaCredits).eq(15);
    expect(player.cardsInHand).deep.eq([nitrogenRichAsteroid]);
  });
});
