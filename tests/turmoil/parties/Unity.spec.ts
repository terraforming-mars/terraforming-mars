import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {cast, setRulingParty} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {UNITY_BONUS_1, UNITY_BONUS_2, UNITY_POLICY_2, UNITY_POLICY_3} from '../../../src/server/turmoil/parties/Unity';
import {SisterPlanetSupport} from '../../../src/server/cards/venusNext/SisterPlanetSupport';
import {VestaShipyard} from '../../../src/server/cards/base/VestaShipyard';
import {LocalShading} from '../../../src/server/cards/venusNext/LocalShading';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Tag} from '../../../src/common/cards/Tag';
import {testGame} from '../../TestGame';
import {PartyName} from '../../../src/common/turmoil/PartyName';

describe('Unity', () => {
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    [game, player] = testGame(1, {turmoilExtension: true});
  });

  it('Ruling bonus 1: Gain 1 M€ for each Venus, Earth and Jovian tag you have', () => {
    player.playedCards.push(new SisterPlanetSupport(), new VestaShipyard());

    const bonus = UNITY_BONUS_1;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(3);
  });

  it('Ruling bonus 2: Gain 1 M€ for each Space tag you have', () => {
    player.playedCards.push(new VestaShipyard());

    const bonus = UNITY_BONUS_2;
    bonus.grant(game);
    expect(player.megaCredits).to.eq(1);
  });

  it('Ruling policy 1: Your titanium resources are worth 1 M€ extra', () => {
    expect(player.getTitaniumValue()).to.eq(3);
    setRulingParty(game, PartyName.UNITY, 'up01');
    expect(player.getTitaniumValue()).to.eq(4);
    setRulingParty(game, PartyName.SCIENTISTS, 'sp01');
    expect(player.getTitaniumValue()).to.eq(3);
  });

  it('Ruling policy 2: Spend 4 M€ to gain 2 titanium or add 2 floaters to any card', () => {
    setRulingParty(game, PartyName.UNITY, 'up02');

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
    const orOptions = cast(game.deferredActions.peek()!.execute(), OrOptions);

    orOptions.options[0].cb();
    expect(localShading.resourceCount).to.eq(2);
    expect(player.megaCredits).to.eq(0);
  });

  it('Ruling policy 3: Spend 4 M€ to draw a Space card', () => {
    setRulingParty(game, PartyName.UNITY, 'up03');

    const unityPolicy = UNITY_POLICY_3;
    player.megaCredits = 7;

    unityPolicy.action(player);
    expect(unityPolicy.canAct(player)).to.be.true;
    game.deferredActions.runNext();

    expect(player.cardsInHand).has.lengthOf(1);
    expect(player.megaCredits).to.eq(3);
    expect(player.cardsInHand[0].tags.includes(Tag.SPACE)).to.be.true;
    expect(unityPolicy.canAct(player)).to.be.false;
  });

  it('Ruling policy 4: Cards with Space tags cost 2 M€ less to play', () => {
    setRulingParty(game, PartyName.UNITY, 'up04');

    const card = new VestaShipyard();
    expect(player.getCardCost(card)).to.eq(card.cost - 2);
  });
});
