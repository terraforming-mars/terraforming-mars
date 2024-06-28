import {expect} from 'chai';
import {RobinsonIndustries} from '../../../src/server/cards/prelude/RobinsonIndustries';
import {IGame} from '../../../src/server/IGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, testGame} from '../../TestingUtils';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

describe('RobinsonIndustries', function() {
  let card: RobinsonIndustries;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new RobinsonIndustries();
    [game, player] = testGame(1);
    player.corporations.push(card);
  });

  it('Can not act', function() {
    player.megaCredits = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act', function() {
    player.megaCredits = 4;
    expect(card.canAct(player)).is.true;

    const result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(6);

    result.options[1].cb();
    runAllActions(game);
    expect(player.production.steel).to.eq(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Only allows to choose from lowest production(s)', function() {
    player.production.add(Resource.MEGACREDITS, -1);
    let result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(1);

    player.production.add(Resource.MEGACREDITS, 5);
    player.production.add(Resource.TITANIUM, 1);
    player.production.add(Resource.PLANTS, 2);

    result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(3);
  });

  it('Helion + Robinson Industries', () => {
    const helion = new Helion();
    helion.play(player);
    player.corporations.push(helion);
    player.megaCredits = 3;
    expect(card.canAct(player)).is.false;
    player.heat = 1;
    expect(card.canAct(player)).is.true;

    // Setting a larger amount of heat just to make the test results more interesting
    player.heat = 5;

    const selectResource = cast(card.action(player), OrOptions);
    expect((selectResource.options[1].title as String).includes('steel')).is.true;

    selectResource.options[1].cb();
    runAllActions(game);
    const selectPayment = cast(player.popWaitingFor(), SelectPayment);
    selectPayment.cb({...Payment.EMPTY, megaCredits: 2, heat: 2});
    expect(player.production.steel).to.eq(1);
    expect(player.megaCredits).to.eq(1);
    expect(player.heat).to.eq(3);
  });
});
