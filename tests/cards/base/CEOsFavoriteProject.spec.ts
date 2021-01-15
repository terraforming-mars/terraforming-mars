import {expect} from 'chai';
import {Birds} from '../../../src/cards/base/Birds';
import {CEOsFavoriteProject} from '../../../src/cards/base/CEOsFavoriteProject';
import {Decomposers} from '../../../src/cards/base/Decomposers';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {SecurityFleet} from '../../../src/cards/base/SecurityFleet';
import {Game} from '../../../src/Game';
import {SelectCard} from '../../../src/inputs/SelectCard';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('CEOsFavoriteProject', function() {
  let card : CEOsFavoriteProject; let player : Player;

  beforeEach(function() {
    card = new CEOsFavoriteProject();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    const searchForLife = new SearchForLife();
    const securityFleet = new SecurityFleet();
    const decomposers = new Decomposers();
    const birds = new Birds();

    player.playedCards.push(searchForLife, securityFleet, decomposers, birds);
    player.addResourceTo(securityFleet);
    player.addResourceTo(decomposers);
    player.addResourceTo(searchForLife);
    player.addResourceTo(birds);

    const action = card.play(player);
    expect(action instanceof SelectCard).is.true;

    action.cb([searchForLife]);
    expect(player.getResourcesOnCard(searchForLife)).to.eq(2);
    action.cb([birds]);
    expect(player.getResourcesOnCard(birds)).to.eq(2);
    action.cb([decomposers]);
    expect(player.getResourcesOnCard(decomposers)).to.eq(2);
    action.cb([securityFleet]);
    expect(player.getResourcesOnCard(securityFleet)).to.eq(2);
  });
});
