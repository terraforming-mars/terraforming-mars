import {expect} from 'chai';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TurmoilPolicy} from '../../src/turmoil/TurmoilPolicy';
import {IParty} from '../../src/turmoil/parties/IParty';
import {resetBoard, setCustomGameOptions, TestPlayers} from '../TestingUtils';
import {Unity, UnityBonus01, UnityBonus02, UnityPolicy02, UnityPolicy03} from '../../src/turmoil/parties/Unity';
import {Phase} from '../../src/Phase';
import {SisterPlanetSupport} from '../../src/cards/venusNext/SisterPlanetSupport';
import {VestaShipyard} from '../../src/cards/base/VestaShipyard';
import {LocalShading} from '../../src/cards/venusNext/LocalShading';
import {OrOptions} from '../../src/inputs/OrOptions';
import {Tags} from '../../src/cards/Tags';

describe('Unity', function() {
  let player : Player; let game : Game; let turmoil: Turmoil; let unity: Unity;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    const gameOptions = setCustomGameOptions();
    game = Game.newInstance('foobar', [player], player, gameOptions);
    turmoil = game.turmoil!;
    unity = new Unity();

    resetBoard(game);
  });

  it('Ruling bonus 1: Gain 1 MC for each Venus, Earth and Jovian tag you have', function() {
    player.playedCards.push(new SisterPlanetSupport(), new VestaShipyard());

    const bonus = new UnityBonus01();
    bonus.grant(game);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 1 MC for each Space tag you have', function() {
    player.playedCards.push(new VestaShipyard());

    const bonus = new UnityBonus02();
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Your titanium resources are worth 1 MC extra', function() {
    setRulingPartyAndRulingPolicy(turmoil, unity, unity.policies[0].id);
    expect(player.getTitaniumValue(game)).to.eq(4);
  });

  it('Ruling policy 2: Spend 4 MC to gain 2 titanium or add 2 floaters to any card', function() {
    setRulingPartyAndRulingPolicy(turmoil, unity, unity.policies[1].id);

    const unityPolicy = new UnityPolicy02();
    player.megaCredits = 8;

    // Gain titanium
    unityPolicy.action(player, game);
    game.deferredActions.runNext();
    expect(player.titanium).to.eq(2);
    expect(player.megaCredits).to.eq(4);

    // Add floaters
    const localShading = new LocalShading();
    player.playedCards.push(localShading);
    unityPolicy.action(player, game);
    game.deferredActions.runNext();
    const orOptions = game.deferredActions.next()!.execute() as OrOptions;

    orOptions.options[0].cb();
    expect(localShading.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Ruling policy 3: Spend 4 MC to draw a Space card', function() {
    setRulingPartyAndRulingPolicy(turmoil, unity, unity.policies[2].id);

    const unityPolicy = new UnityPolicy03();
    player.megaCredits = 7;

    unityPolicy.action(player, game);
    expect(unityPolicy.canAct(player)).to.be.true;
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    expect(player.cardsInHand[0].tags.includes(Tags.SPACE)).to.be.true;
    expect(unityPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 4: Cards with Space tags cost 2 MC less to play', function() {
    setRulingPartyAndRulingPolicy(turmoil, unity, unity.policies[3].id);

    const card = new VestaShipyard();
    expect(player.getCardCost(game, card)).to.eq(card.cost - 2);
  });

  function setRulingPartyAndRulingPolicy(turmoil: Turmoil, party: IParty, policyId: TurmoilPolicy) {
    turmoil.rulingParty = party;
    turmoil.politicalAgendasData.currentAgenda = {bonusId: party.bonuses[0].id, policyId: policyId};
    game.phase = Phase.ACTION;
  }
});
