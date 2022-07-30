import {expect} from 'chai';
import {RobinsonIndustries} from '../../../src/cards/prelude/RobinsonIndustries';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Resources} from '../../../src/common/Resources';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('RobinsonIndustries', function() {
  let card: RobinsonIndustries;
  let player: TestPlayer;

  beforeEach(function() {
    card = new RobinsonIndustries();
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
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
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Only allows to choose from lowest production(s)', function() {
    player.addProduction(Resources.MEGACREDITS, -1);
    let result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(1);

    player.addProduction(Resources.MEGACREDITS, 5);
    player.addProduction(Resources.TITANIUM, 1);
    player.addProduction(Resources.PLANTS, 2);

    result = cast(card.action(player), OrOptions);
    expect(result.options).has.lengthOf(3);
  });
});
