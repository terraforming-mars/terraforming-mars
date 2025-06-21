import {expect} from 'chai';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Phase} from '../../../src/common/Phase';
import {Mine} from '../../../src/server/cards/base/Mine';
import {TerraformingDeal} from '../../../src/server/cards/prelude2/TerraformingDeal';
import {UNMIContractor} from '../../../src/server/cards/prelude/UNMIContractor';
import {IGame} from '../../../src/server/IGame';
import {Election} from '../../../src/server/turmoil/globalEvents/Election';
import {runAllActions} from '../../../tests/TestingUtils';

describe('TerraformingDeal', () => {
  let card: TerraformingDeal;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new TerraformingDeal();
    [game, player, player2] = testGame(3, {turmoilExtension: true});
  });

  it('Gains 2 MC whenever player raises TR during action phase', () => {
    player.playedCards.push(card);
    game.phase = Phase.ACTION;

    player.increaseTerraformRating();
    expect(player.megaCredits).eq(2);

    player2.increaseTerraformRating();
    expect(player.megaCredits).eq(2);

    player.increaseTerraformRating(3);
    expect(player.megaCredits).eq(8);
  });

  it('Gives MC during initial preludes phase', () => {
    player.playedCards.push(card);
    game.phase = Phase.PRELUDES;

    const contractor = new UNMIContractor();
    contractor.play(player);
    expect(player.megaCredits).eq(6);
  });

  it('Gives MC during resolving global events', () => {
    player.playedCards.push(card);
    game.phase = Phase.SOLAR;
    game.inTurmoil = true;

    const turmoil = game.turmoil!;
    player2.playedCards.push(new Mine());
    turmoil.initGlobalEvent(game);

    const election = new Election();
    election.resolve(game, turmoil);
    expect(player2.getTerraformRating()).eq(22);
    expect(player2.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(2);
  });

  it('Gives resolving chairman', () => {
    player.playedCards.push(card);
    game.phase = Phase.SOLAR;
    game.inTurmoil = true;

    const turmoil = game.turmoil!;
    turmoil.setNewChairman(player, game);
    runAllActions(game);

    expect(player.getTerraformRating()).eq(21);
    expect(player.megaCredits).eq(2);
  });
});
