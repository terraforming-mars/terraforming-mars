import {expect} from 'chai';
import {EcologyExperts} from '../../../src/server/cards/prelude/EcologyExperts';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {Ants} from '../../../src/server/cards/base/Ants';
import {SelectProjectCardToPlay} from '../../../src/server/inputs/SelectProjectCardToPlay';

describe('EcologyExperts', function() {
  let card: EcologyExperts;
  let player: TestPlayer;

  beforeEach(function() {
    card = new EcologyExperts();
    [/* game */, player] = testGame(1);
  });

  it('Gets requirement bonus', function() {
    expect(card.getGlobalParameterRequirementBonus(player)).to.eq(0);
    player.lastCardPlayed = card.name;
    expect(card.getGlobalParameterRequirementBonus(player)).to.eq(50);
  });

  it('Should play', function() {
    // AI Central needs 3 science tags.
    const aiCentral = new AICentral();
    // Ants needs 4% oxygen
    const ants = new Ants();
    player.cardsInHand = [aiCentral, ants];
    player.megaCredits = Math.max(aiCentral.cost, ants.cost);

    expect(player.canPlay(aiCentral)).is.false;
    expect(player.canPlay(ants)).is.false;

    player.playCard(card);
    runAllActions(player.game);
    const selectProjectCardToPlay = cast(player.popWaitingFor(), SelectProjectCardToPlay);
    expect(selectProjectCardToPlay.cards).deep.eq([ants]);

    // Ecology Experts doesn't touch tag requirements.
    expect(player.canPlay(aiCentral)).is.false;
    // But it does touch global requirements.
    expect(player.canPlay(ants)).is.true;
  });
});
