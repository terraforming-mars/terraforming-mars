import {expect} from 'chai';
import {Player} from '../../../src/Player';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Unity, UNITY_BONUS_1, UNITY_BONUS_2, UNITY_POLICY_2, UNITY_POLICY_3} from '../../../src/turmoil/parties/Unity';
import {SisterPlanetSupport} from '../../../src/cards/venusNext/SisterPlanetSupport';
import {VestaShipyard} from '../../../src/cards/base/VestaShipyard';
import {LocalShading} from '../../../src/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Tags} from '../../../src/common/cards/Tags';

describe('Unity', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let unity: Unity;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = TestingUtils.setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    unity = new Unity();

    TestingUtils.resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 M€ for each Venus, Earth and Jovian tag you have', function() {
    player.playedCards.push(new SisterPlanetSupport(), new VestaShipyard());

    const bonus = UNITY_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 1 M€ for each Space tag you have', function() {
    player.playedCards.push(new VestaShipyard());

    const bonus = UNITY_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Your titanium resources are worth 1 M€ extra', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, unity, unity.policies[0].id);
    expect(player.getTitaniumValue()).to.eq(4);
  });

  it('Ruling policy 2: Spend 4 M€ to gain 2 titanium or add 2 floaters to any card', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, unity, unity.policies[1].id);

    const unityPolicy = UNITY_POLICY_2;
    player.megaCredits = 8;

    // Gain titanium
    unityPolicy.action(player);
    game.deferredActions.runNext();
    expect(player.titanium).to.eq(2);
    expect(player.megaCredits).to.eq(4);

    // Add floaters
    const localShading = new LocalShading();
    player.playedCards.push(localShading);
    unityPolicy.action(player);
    game.deferredActions.runNext();
    const orOptions = game.deferredActions.peek()!.execute() as OrOptions;

    orOptions.options[0].cb();
    expect(localShading.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Ruling policy 3: Spend 4 M€ to draw a Space card', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, unity, unity.policies[2].id);

    const unityPolicy = UNITY_POLICY_3;
    player.megaCredits = 7;

    unityPolicy.action(player);
    expect(unityPolicy.canAct(player)).to.be.true;
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    expect(player.cardsInHand[0].tags.includes(Tags.SPACE)).to.be.true;
    expect(unityPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 4: Cards with Space tags cost 2 M€ less to play', function() {
    TestingUtils.setRulingPartyAndRulingPolicy(game, turmoil, unity, unity.policies[3].id);

    const card = new VestaShipyard();
    expect(player.getCardCost(card)).to.eq(card.cost - 2);
  });
});
