import {expect} from 'chai';
import {Omnicourt} from '../../../src/cards/venusNext/Omnicourt';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestPlayers';

describe('Omnicourt', function() {
  it('Should play', function() {
    const card = new Omnicourt();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    Game.newInstance('foobar', [player, redPlayer], player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {jovian: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {jovian: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1};
    expect(player.canPlayIgnoringCost(card)).is.not.true;

    player.tagsForTest = {venus: 1, jovian: 1, earth: 1};
    expect(player.canPlayIgnoringCost(card)).is.true;

    const action = card.play(player);
    expect(action).is.undefined;
    expect(player.getTerraformRating()).to.eq(22);
  });
});
