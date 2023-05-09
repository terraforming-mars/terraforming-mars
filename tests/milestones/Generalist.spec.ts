import {expect} from 'chai';
import {Game} from '../../src/server/Game';
import {Generalist} from '../../src/server/milestones/Generalist';
import {ALL_RESOURCES} from '../../src/common/Resource';
import {testGameOptions} from '../TestingUtils';
import {TestPlayer} from '../TestPlayer';

describe('Generalist', function() {
  let milestone: Generalist;
  let player: TestPlayer;
  let player2: TestPlayer;

  beforeEach(function() {
    milestone = new Generalist();
    player = TestPlayer.BLUE.newPlayer();
    player2 = TestPlayer.RED.newPlayer();
  });

  it('Can claim with +1 of each production in game with corp era', function() {
    Game.newInstance('gameid', [player, player2], player);
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    expect(milestone.canClaim(player)).is.true;
  });

  it('Cannot claim with +1 of each production in game without corp era', function() {
    const gameOptions = testGameOptions({corporateEra: false});
    Game.newInstance('gameid', [player, player2], player, gameOptions);

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(1));
    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with +2 of each production in game without corp era', function() {
    const gameOptions = testGameOptions({corporateEra: false});
    Game.newInstance('gameid', [player, player2], player, gameOptions);
    ALL_RESOURCES.forEach((resource) => player.production.add(resource, 1));

    ALL_RESOURCES.forEach((resource) => expect(player.production[resource]).to.eq(2));
    expect(milestone.canClaim(player)).is.true;
  });
});
