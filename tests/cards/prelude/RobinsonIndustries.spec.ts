import {expect} from 'chai';
import {RobinsonIndustries} from '../../../src/cards/prelude/RobinsonIndustries';
import {Game} from '../../../src/Game';
import {OrOptions} from '../../../src/inputs/OrOptions';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestPlayers';

describe('RobinsonIndustries', function() {
  let card : RobinsonIndustries; let player : Player;

  beforeEach(function() {
    card = new RobinsonIndustries();
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    player.corporationCard = card;
  });

  it('Can\'t act', function() {
    player.megaCredits = 3;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act', function() {
    player.megaCredits = 4;
    expect(card.canAct(player)).is.true;

    const result = card.action(player) as OrOptions;
    expect(result.options).has.lengthOf(6);

    result.options[1].cb();
    expect(player.getProduction(Resources.STEEL)).to.eq(1);
    expect(player.megaCredits).to.eq(0);
  });

  it('Only allows to choose from lowest production(s)', function() {
    player.addProduction(Resources.MEGACREDITS, -1);
    let result = card.action(player) as OrOptions;
    expect(result.options).has.lengthOf(1);

    player.addProduction(Resources.MEGACREDITS, 5);
    player.addProduction(Resources.TITANIUM, 1);
    player.addProduction(Resources.PLANTS, 2);

    result = card.action(player) as OrOptions;
    expect(result.options).has.lengthOf(3);
  });
});
