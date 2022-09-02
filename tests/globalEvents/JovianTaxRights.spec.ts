import {expect} from 'chai';
import {Luna} from '../../src/server/colonies/Luna';
import {Triton} from '../../src/server/colonies/Triton';
import {Game} from '../../src/server/Game';
import {Resources} from '../../src/common/Resources';
import {JovianTaxRights} from '../../src/server/turmoil/globalEvents/JovianTaxRights';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('JovianTaxRights', function() {
  it('resolve play', function() {
    const card = new JovianTaxRights();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    const colony1 = new Luna();
    const colony2 = new Triton();
    colony1.colonies.push(player2.id);
    colony2.colonies.push(player2.id);
    game.colonies.push(colony1);
    game.colonies.push(colony2);

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.TITANIUM)).to.eq(0);
    expect(player2.getResource(Resources.TITANIUM)).to.eq(3);
    expect(player.production.megacredits).to.eq(0);
    expect(player2.production.megacredits).to.eq(2);
  });
});
