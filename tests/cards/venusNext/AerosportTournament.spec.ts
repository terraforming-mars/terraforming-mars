import {expect} from 'chai';
import {AerosportTournament} from '../../../src/server/cards/venusNext/AerosportTournament';
import {Celestic} from '../../../src/server/cards/venusNext/Celestic';
import {getTestPlayer, newTestGame} from '../../TestGame';

describe('AerosportTournament', function() {
  it('Should play', function() {
    const card = new AerosportTournament();
    const corp = new Celestic();
    const game = newTestGame(2);
    const player = getTestPlayer(game, 0);
    player.setCorporationForTest(corp);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    corp.action(player);
    expect(player.canPlayIgnoringCost(card)).is.true;

    game.addCityTile(player, '03');

    const play = card.play(player);
    expect(play).is.undefined;
    expect(player.megaCredits).to.eq(1);
  });
});
