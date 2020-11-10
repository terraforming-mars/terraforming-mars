import {expect} from 'chai';
import {Generalist} from '../../src/milestones/Generalist';
import {Color} from '../../src/Color';
import {Player} from '../../src/Player';
import {Game} from '../../src/Game';
import {Resources} from '../../src/Resources';
import {setCustomGameOptions} from '../TestingUtils';

describe('Generalist', function() {
  let milestone : Generalist; let player : Player; let player2: Player; let resources: Resources[];

  beforeEach(function() {
    milestone = new Generalist();
    player = new Player('test', Color.BLUE, false);
    player2 = new Player('test2', Color.RED, false);

    resources = [Resources.MEGACREDITS, Resources.STEEL, Resources.TITANIUM, Resources.PLANTS, Resources.ENERGY, Resources.HEAT];
  });

  it('Can claim with +1 of each production in game with corp era', function() {
    const game = new Game('foobar', [player, player2], player);
    resources.forEach((resource) => player.addProduction(resource));

    expect(milestone.canClaim(player, game)).is.true;
  });

  it('Cannot claim with +1 of each production in game without corp era', function() {
    const gameOptions = setCustomGameOptions({corporateEra: false});
    const game = new Game('foobar', [player, player2], player, gameOptions);

    resources.forEach((resource) => expect(player.getProduction(resource)).to.eq(1));
    expect(milestone.canClaim(player, game)).is.not.true;
  });

  it('Can claim with +2 of each production in game without corp era', function() {
    const gameOptions = setCustomGameOptions({corporateEra: false});
    const game = new Game('foobar', [player, player2], player, gameOptions);
    resources.forEach((resource) => player.addProduction(resource));

    resources.forEach((resource) => expect(player.getProduction(resource)).to.eq(2));
    expect(milestone.canClaim(player, game)).is.true;
  });
});
