import {expect} from 'chai';
import {Research} from '../../src/cards/base/Research';
import {Game} from '../../src/Game';
import {Resources} from '../../src/common/Resources';
import {SpinoffProducts} from '../../src/turmoil/globalEvents/SpinoffProducts';
import {Kelvinists} from '../../src/turmoil/parties/Kelvinists';
import {Turmoil} from '../../src/turmoil/Turmoil';
import {getTestPlayer, newTestGame} from '../TestGame';
import {TestPlayer} from '../TestPlayer';
import {HabitatMarte} from '../../src/cards/pathfinders/HabitatMarte';
import {DesignedOrganisms} from '../../src/cards/pathfinders/DesignedOrganisms';
import {TestingUtils} from '../TestingUtils';

describe('SpinoffProducts', function() {
  let card: SpinoffProducts;
  let game: Game;
  let player: TestPlayer;
  let player2: TestPlayer;
  let turmoil: Turmoil;

  beforeEach(() => {
    card = new SpinoffProducts();
    game = newTestGame(2, TestingUtils.setCustomGameOptions());
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    turmoil = game.turmoil!;
  });

  it('resolve play', function() {
    player.playedCards.push(new Research());
    player2.playedCards.push(new Research());
    player2.playedCards.push(new Research());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(4);
    expect(player2.getResource(Resources.MEGACREDITS)).to.eq(14);
  });

  it('resolve play, with Habitat Marte', function() {
    player.corporationCard = new HabitatMarte();
    player.playedCards.push(new Research(), new DesignedOrganisms());

    turmoil.chairman = player2.id;
    turmoil.dominantParty = new Kelvinists();
    turmoil.dominantParty.partyLeader = player2.id;
    turmoil.dominantParty.delegates.push(player2.id);
    turmoil.dominantParty.delegates.push(player2.id);

    card.resolve(game, turmoil);

    // This includes Habitat Marte itself, which has a Mars tag.
    expect(player.getResource(Resources.MEGACREDITS)).to.eq(8);
  });
});
