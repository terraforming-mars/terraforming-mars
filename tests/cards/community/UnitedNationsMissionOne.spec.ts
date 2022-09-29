import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {Mine} from '../../../src/server/cards/base/Mine';
import {UnitedNationsMissionOne} from '../../../src/server/cards/community/UnitedNationsMissionOne';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';
import {Game} from '../../../src/server/Game';
import {Election} from '../../../src/server/turmoil/globalEvents/Election';

describe('UnitedNationsMissionOne', function() {
  let card: UnitedNationsMissionOne;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: Game;

  beforeEach(() => {
    card = new UnitedNationsMissionOne();
    game = newTestGame(2, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
  });

  it('Initializes correctly', function() {
    expect(player.getTerraformRating()).eq(20);
    expect(player.megaCredits).eq(0);

    player.playCorporationCard(card);

    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(40);
  });

  it('Gains 1 MC whenever any player raises TR during action phase', function() {
    player.corporations.push(card);
    game.phase = Phase.ACTION;

    player.increaseTerraformRating();
    expect(player.megaCredits).eq(1);

    player2.increaseTerraformRating();
    expect(player.megaCredits).eq(2);

    player2.increaseTerraformRatingSteps(3);
    expect(player.megaCredits).eq(5);
  });

  it('Gives MC during initial preludes phase', function() {
    player.corporations.push(card);
    game.phase = Phase.PRELUDES;

    const contractor = new UNMIContractor();
    contractor.play(player);
    expect(player.megaCredits).eq(3);
  });

  it('Does not give MC during turmoil phase', function() {
    player.corporations.push(card);
    game.phase = Phase.PRODUCTION;

    const turmoil = game.turmoil!;
    player2.playedCards.push(new Mine());
    turmoil.initGlobalEvent(game);

    const election = new Election();
    election.resolve(game, turmoil);
    expect(player2.getTerraformRating()).eq(22);
    expect(player.megaCredits).eq(0); // no increase
  });
});
