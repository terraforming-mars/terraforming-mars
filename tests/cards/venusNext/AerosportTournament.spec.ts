import {expect} from 'chai';
import {addCityTile} from '../../TestingUtils';
import {AerosportTournament} from '../../../src/server/cards/venusNext/AerosportTournament';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {testGame} from '../../TestGame';

describe('AerosportTournament', function() {
  it('Should play', function() {
    const card = new AerosportTournament();
    const corp = new Celestic();
    const [, player] = testGame(2);
    player.setCorporationForTest(corp);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    addCityTile(player, '03');

    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.megaCredits).to.eq(1);
  });
});
