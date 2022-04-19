import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Scientists, SCIENTISTS_BONUS_1, SCIENTISTS_BONUS_2, SCIENTISTS_POLICY_1, SCIENTISTS_POLICY_2, SCIENTISTS_POLICY_3, SCIENTISTS_POLICY_4} from '../../../src/turmoil/parties/Scientists';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {Research} from '../../../src/cards/base/Research';
import {GeneRepair} from '../../../src/cards/base/GeneRepair';
import {PrideoftheEarthArkship} from '../../../src/cards/moon/PrideoftheEarthArkship';
import {SpaceStation} from '../../../src/cards/base/SpaceStation';
import {Satellites} from '../../../src/cards/base/Satellites';
import {HabitatMarte} from '../../../src/cards/pathfinders/HabitatMarte';
import {DesignedOrganisms} from '../../../src/cards/pathfinders/DesignedOrganisms';

describe('Scientists', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let scientists: Scientists;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    scientists = new Scientists();

    TestingUtils.resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 M€ for each Science tag you have', function() {
    player.playedCards.push(new SearchForLife());

    const bonus = SCIENTISTS_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling bonus 1: Gain 1 M€ for each Science tag you have, with Habitat Marte', function() {
    player.corporationCard = new HabitatMarte();
    player.playedCards.push(new SearchForLife(), new DesignedOrganisms());

    const bonus = SCIENTISTS_BONUS_1;
    bonus.grant(game);

    // This includes Habitat Marte itself, which has a Mars tag.
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 1 M€ for every 3 cards in hand', function() {
    player.cardsInHand.push(new SearchForLife(), new Research(), new GeneRepair());

    const bonus = SCIENTISTS_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Pay 10 M€ to draw 3 cards', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, scientists, SCIENTISTS_POLICY_1.id);

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
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, scientists, SCIENTISTS_POLICY_2.id);

    const card = new SearchForLife();
    (game as any).oxygenLevel = 8;
    expect(player.canPlayIgnoringCost(card)).to.be.true;
  });

  it('Ruling policy 3: When you raise a global parameter, draw a card per step raised', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, scientists, SCIENTISTS_POLICY_3.id);

    game.increaseOxygenLevel(player, 1);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(1);

    game.increaseTemperature(player, 2);
    game.deferredActions.runNext();
    expect(player.cardsInHand).has.lengthOf(3);
  });

  it('Ruling policy 4: Cards with Science tag requirements may be played with 1 less Science tag', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, scientists, SCIENTISTS_POLICY_4.id);

    const card = new GeneRepair();
    expect(player.canPlayIgnoringCost(card)).to.be.false;

    const scientistsPolicy = SCIENTISTS_POLICY_4;
    scientistsPolicy.apply(game);
    player.playedCards.push(new Research());
    expect(player.canPlayIgnoringCost(card)).to.be.true;
  });

  it('Ruling policy 4: Cards with multiple tag requirements may be played with 1 less Science tag', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, scientists, SCIENTISTS_POLICY_4.id);

    // Meet all card requirements except the Science tag
    player.playedCards.push(new SpaceStation(), new Satellites());
    player.titanium = 2;
    const card = new PrideoftheEarthArkship();
    expect(player.canPlayIgnoringCost(card)).to.be.false;

    const scientistsPolicy = SCIENTISTS_POLICY_4;
    scientistsPolicy.apply(game);
    expect(player.canPlayIgnoringCost(card)).to.be.true;
  });
});
