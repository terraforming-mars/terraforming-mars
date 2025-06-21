import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {Mine} from '../../../src/server/cards/base/Mine';
import {UnitedNationsMissionOne} from '../../../src/server/cards/community/UnitedNationsMissionOne';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';
import {IGame} from '../../../src/server/IGame';
import {Election} from '../../../src/server/turmoil/globalEvents/Election';

describe('UnitedNationsMissionOne', () => {
  let card: UnitedNationsMissionOne;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new UnitedNationsMissionOne();
    [game, player, player2] = testGame(3, {turmoilExtension: true});
  });

  it('Initializes correctly', () => {
    expect(player.getTerraformRating()).eq(20);
    expect(player.megaCredits).eq(0);

    player.playCorporationCard(card);

    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(40);
  });

  it('Gains 1 MC whenever any player raises TR during action phase', () => {
    player.corporations.push(card);
    game.phase = Phase.ACTION;

    player.increaseTerraformRating();
    expect(player.megaCredits).eq(1);

    player2.increaseTerraformRating();
    expect(player.megaCredits).eq(2);

    player2.increaseTerraformRating(3);
    expect(player.megaCredits).eq(5);
  });

  it('Gives MC during initial preludes phase', () => {
    player.corporations.push(card);
    game.phase = Phase.PRELUDES;

    const contractor = new UNMIContractor();
    contractor.play(player);
    expect(player.megaCredits).eq(3);
  });

  it('Does not give MC during turmoil phase', () => {
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
