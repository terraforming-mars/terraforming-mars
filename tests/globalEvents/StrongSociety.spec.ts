import {expect} from 'chai';
import {StrongSociety} from '../../src/server/turmoil/globalEvents/StrongSociety';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {addCity, testGame} from '../TestingUtils';
import {SpaceName} from '../../src/common/boards/SpaceName';

describe('StrongSociety', () => {
  it('resolve play', () => {
    const card = new StrongSociety();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    addCity(player);
    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game);
    expect(player.megaCredits).to.eq(2);
    expect(player2.megaCredits).to.eq(6);
  });

  it('counts cities off Mars, and only your own', () => {
    const card = new StrongSociety();
    const [game, player, player2] = testGame(2, {turmoilExtension: true});

    addCity(player);
    addCity(player, SpaceName.GANYMEDE_COLONY);
    addCity(player2);

    card.resolve(game);

    // Two cities each worth 2 M€. The opponent's city is theirs, not yours.
    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(2);
  });
});
