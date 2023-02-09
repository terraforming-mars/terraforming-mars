import {expect} from 'chai';
import {RobinsonIndustries} from '../../../src/server/cards/prelude/RobinsonIndustries';
import {Game} from '../../../src/server/Game';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {SelectPayment} from '../../../src/server/inputs/SelectPayment';
import {Payment} from '../../../src/common/inputs/Payment';

describe('RobinsonIndustries', function() {
  let card: RobinsonIndustries;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new RobinsonIndustries();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    player.setCorporationForTest(card);
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
    player.production.add(Resources.MEGACREDITS, -1);
    let result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(1);

    player.production.add(Resources.MEGACREDITS, 5);
    player.production.add(Resources.TITANIUM, 1);
    player.production.add(Resources.PLANTS, 2);

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
