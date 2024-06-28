import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {setRulingParty, setOxygenLevel} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2, SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4} from '../../../src/server/turmoil/parties/Scientists';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {Research} from '../../../src/server/cards/base/Research';
import {GeneRepair} from '../../../src/server/cards/base/GeneRepair';
import {PrideoftheEarthArkship} from '../../../src/server/cards/moon/PrideoftheEarthArkship';
import {SpaceStation} from '../../../src/server/cards/base/SpaceStation';
import {Satellites} from '../../../src/server/cards/base/Satellites';
import {HabitatMarte} from '../../../src/server/cards/pathfinders/HabitatMarte';
import {DesignedOrganisms} from '../../../src/server/cards/pathfinders/DesignedOrganisms';
import {testGame} from '../../TestGame';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Scientists', function() {
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    [game, player] = testGame(1, {turmoilExtension: true});
  });

  it('Ruling bonus 1: Gain 1 M€ for each science tag you have', function() {
    player.playedCards.push(new SearchForLife());

    const bonus = SCIENTISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling bonus 1: Gain 1 M€ for each science tag you have, with Habitat Marte', function() {
    player.corporations.push(new HabitatMarte());
    player.playedCards.push(new SearchForLife(), new DesignedOrganisms());

    const bonus = SCIENTISTS_BONUS_1;
    bonus.grant(game);

    // This includes Habitat Marte itself, which has a Mars tag.
    expect(player.megaCredits).to.eq(4);
  });

  it('Ruling bonus 2: Gain 1 M€ for every 3 cards in hand', function() {
    player.cardsInHand.push(new SearchForLife(), new Research(), new GeneRepair());

    const bonus = SCIENTISTS_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Pay 10 M€ to draw 3 cards', function() {
    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_1.id);

    const scientistsPolicy = SCIENTISTS_POLICY_1;
    player.megaCredits = 10;
    expect(scientistsPolicy.canAct(player)).to.be.true;

    scientistsPolicy.action(player);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(3);
    expect(player.megaCredits).to.eq(0);
    expect(scientistsPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 2: Your global requirements are +/- 2 steps', function() {
    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_2.id);

    const card = new SearchForLife();
    setOxygenLevel(game, 8);
    expect(card.canPlay(player)).to.be.true;
  });

  it('Ruling policy 3: When you raise a global parameter, draw a card per step raised', function() {
    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_3.id);

    game.increaseOxygenLevel(player, 1);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(1);

    game.increaseTemperature(player, 2);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(3);
  });

  it('Ruling policy 4: Cards with Science tag requirements may be played with 1 less Science tag', function() {
    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_4.id);

    const card = new GeneRepair();
    expect(card.canPlay(player)).to.be.false;

    const scientistsPolicy = SCIENTISTS_POLICY_4;
    scientistsPolicy.onPolicyStart(game);
    player.playedCards.push(new Research());
    expect(card.canPlay(player)).to.be.true;
  });

  it('Ruling policy 4: Cards with multiple tag requirements may be played with 1 less Science tag', function() {
    // Meet all card requirements except the Science tag
    player.playedCards.push(new SpaceStation(), new Satellites());
    player.titanium = 2;
    const card = new PrideoftheEarthArkship();
    expect(card.canPlay(player)).to.be.false;

    setRulingParty(game, PartyName.SCIENTISTS, SCIENTISTS_POLICY_4.id);
    const scientistsPolicy = SCIENTISTS_POLICY_4;
    scientistsPolicy.onPolicyStart(game);
    expect(card.canPlay(player)).to.be.true;
    scientistsPolicy.onPolicyEnd(game);
    expect(card.canPlay(player)).to.be.false;
  });
});
