import {expect} from 'chai';
import {AdvancedAlloys} from '../../../src/server/cards/base/AdvancedAlloys';
import {Research} from '../../../src/server/cards/base/Research';
import {ResearchCoordination} from '../../../src/server/cards/prelude/ResearchCoordination';
import {OrbitalCleanup} from '../../../src/server/cards/promo/OrbitalCleanup';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {setRulingParty} from '../../TestingUtils';
import {BioengineeringEnclosure} from '../../../src/server/cards/ares/BioengineeringEnclosure';
import {PartyName} from '../../../src/common/turmoil/PartyName';
import {SCIENTISTS_POLICY_4} from '../../../src/server/turmoil/parties/Scientists';

describe('OrbitalCleanup', function() {
  let card: OrbitalCleanup;
  let player: TestPlayer;

  beforeEach(function() {
    card = new OrbitalCleanup();
    [/* game */, player] = testGame(1);
  });

  it('Can not play if cannot decrease MC production', function() {
    player.production.add(Resource.MEGACREDITS, -4);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.megacredits).to.eq(-2);
  });

  it('Should act', function() {
    player.playedCards.push(new Research());
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new ResearchCoordination());

    card.action(player);
    expect(player.megaCredits).to.eq(4);
  });

  it('Should give victory points', function() {
    card.play(player);
    expect(card.getVictoryPoints(player)).to.eq(2);
  });

  it('Turmoil Science Tag Requirements doesnt increase Income', function() {
    const [game, player] = testGame(2, {ceoExtension: true, turmoilExtension: true});

    // Sanity check that Science Ruling Policy is working as intended:
    const bioengineeringEnclosure = new BioengineeringEnclosure(); // Requires 1 science tag
    expect(player.simpleCanPlay(bioengineeringEnclosure)).is.false;
    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_4.id); // Reduce science tag requirements by 1
    SCIENTISTS_POLICY_4.onPolicyStart(game);
    expect(player.simpleCanPlay(bioengineeringEnclosure)).is.true;

    // Make sure that we do not get 1MC for the Science Ruling Policy
    player.playedCards.push(new Research());
    player.playedCards.push(new AdvancedAlloys());
    player.playedCards.push(new ResearchCoordination());

    expect(player.megaCredits).to.eq(0);
    card.action(player);
    expect(player.megaCredits).to.eq(4);
  });
});
