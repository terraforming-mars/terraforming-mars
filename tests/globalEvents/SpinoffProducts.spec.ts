import {expect} from 'chai';
import {Research} from '../../src/server/cards/base/Research';
import {Game} from '../../src/server/Game';
import {SpinoffProducts} from '../../src/server/turmoil/globalEvents/SpinoffProducts';
import {Kelvinists} from '../../src/server/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/server/turmoil/Turmoil';
import {testGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';
import {HabitatMarte} from '../../src/server/cards/pathfinders/HabitatMarte';
import {DesignedOrganisms} from '../../src/server/cards/pathfinders/DesignedOrganisms';

describe('SpinoffProducts', function() {
  let card: SpinoffProducts;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new SpinoffProducts();
    [game, player, player2] = testGame(2, {turmoilExtension: true});
    turmoil = game.turmoil!;
  });

  it('resolve play', function() {
    player.playedCards.push(new Research());
    player2.playedCards.push(new Research());
    player2.playedCards.push(new Research());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);
    expect(player.megaCredits).to.eq(4);
    expect(player2.megaCredits).to.eq(14);
  });

  it('resolve play, with Habitat Marte', function() {
    player.setCorporationForTest(new HabitatMarte());
    player.playedCards.push(new Research(), new DesignedOrganisms());

    turmoil.chairman = player2;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2;
    turmoil.dominantParty.delegates.add(player2);
    turmoil.dominantParty.delegates.add(player2);

    card.resolve(game, turmoil);

    // This includes Habitat Marte itself, which has a Mars tag.
    expect(player.megaCredits).to.eq(10);
  });
});
