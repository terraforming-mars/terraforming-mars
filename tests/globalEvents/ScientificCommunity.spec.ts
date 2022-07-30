import {expect} from 'chai';
import {Ants} from '../../src/cards/base/Ants';
import {SecurityFleet} from '../../src/cards/base/SecurityFleet';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {ScientificCommunity} from '../../src/turmoil/globalEvents/ScientificCommunity';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {TestPlayer} from '../TestPlayer';

describe('ScientificCommunity', function() {
  it('resolve play', function() {
    const card = new ScientificCommunity();
    const player = TestPlayer.BLUE.newPlayer();
    const player2 = TestPlayer.RED.newPlayer();
    const game = Game.newInstance('gameid', [player, player2], player);
    const turmoil = Turmoil.newInstance(game);

    player.cardsInHand.push(new Ants());
    player2.cardsInHand.push(new SecurityFleet(), new Ants());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(1);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(5);
  });
});
