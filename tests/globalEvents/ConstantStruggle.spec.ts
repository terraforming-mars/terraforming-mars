import {expect} from 'chai';
import {ConstantStruggle} from '../../src/server/turmoil/globalEvents/ConstantStruggle';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {newTestGame} from '../TestGame';

describe('ConstantStruggle', function() {
  it('resolve play', function() {
    const card = new ConstantStruggle();
    const game = newTestGame(2, {turmoilExtension: true, pathfindersExpansion: true});
    const [player, player2] = game.testPlayers;
    const turmoil = game.turmoil!;

    player.megaCredits = 8;
    player2.megaCredits = 12;

    turmoil.initGlobalEvent(game);
    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player.id);
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    expect(game.pathfindersData).deep.eq({
      venus: 0,
      earth: 0,
      mars: 0,
      jovian: 0,
      moon: -1,
      vps: [],
    });

    card.resolve(game, turmoil);

    expect(player.megaCredits).eq(0);
    expect(player2.megaCredits).eq(5);

    expect(game.pathfindersData).deep.eq({
      venus: 2,
      earth: 2,
      mars: 2,
      jovian: 2,
      moon: -1,
      vps: [],
    });

    expect(player.titanium).eq(0);
    expect(player2.titanium).eq(0);
  });
});
