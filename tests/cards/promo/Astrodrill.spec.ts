import {expect} from 'chai';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {ICard} from '../../../src/server/cards/ICard';
import {Astrodrill} from '../../../src/server/cards/promo/Astrodrill';
import {CometAiming} from '../../../src/server/cards/promo/CometAiming';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TestPlayer} from '../../TestPlayer';
import {SelectOption} from '../../../src/server/inputs/SelectOption';

describe('Astrodrill', function() {
  let card: Astrodrill;
  let player: TestPlayer;

  beforeEach(function() {
    card = new Astrodrill();
    [/* game */, player/* , player2 */] = testGame(2);
    player.corporations.push(card);
    card.play(player);
    runAllActions(player.game);
  });

  it('Starts with 3 asteroid resources', function() {
    expect(card.resourceCount).to.eq(3);
  });

  it('Should play - can spend asteroid resource', function() {
    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(3);

    // spend asteroid resource
    const spendAsteroidOption = action.options[0];
    spendAsteroidOption.cb();
    expect(player.titanium).to.eq(3);
    expect(player.game.deferredActions).has.lengthOf(0);
  });

  it('Should play - can add asteroid resource to self', function() {
    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(3);

    // add asteroid resource and gain standard resource
    const addAsteroidOption = cast(action.options[1], SelectOption);
    const result = addAsteroidOption.cb(undefined);
    expect(card.resourceCount).to.eq(4);
    expect(result).is.undefined;
  });

  it('Should play - can add asteroid resource to other card', function() {
    const cometAiming = new CometAiming();
    player.playedCards.push(cometAiming);

    const action = cast(card.action(player), OrOptions);
    const addAsteroidOption = cast(action.options[1], SelectCard<ICard>);

    const result = addAsteroidOption.cb([cometAiming]);
    expect(cometAiming.resourceCount).to.eq(1);
    expect(result).is.undefined;
  });

  it('Should play - can gain a standard resource', function() {
    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(3);

    const resourceChoices = cast(action.options[2].cb(), OrOptions);
    expect(resourceChoices.options).has.lengthOf(6);

    resourceChoices.options[1].cb();
    expect(player.steel).to.eq(1);

    resourceChoices.options[4].cb();
    expect(player.heat).to.eq(1);
  });
});
