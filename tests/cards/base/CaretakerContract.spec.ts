import {expect} from 'chai';
import {CaretakerContract} from '../../../src/cards/base/CaretakerContract';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {TestingUtils} from '../../TestingUtils';
import {TestPlayers} from '../../TestPlayers';
import {Phase} from '../../../src/Phase';
import {Greens} from '../../../src/turmoil/parties/Greens';
import {Reds} from '../../../src/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/turmoil/PoliticalAgendas';
import {Helion} from '../../../src/cards/corporation/Helion';
import {StormCraftIncorporated} from '../../../src/cards/colonies/StormCraftIncorporated';

describe('CaretakerContract', function() {
  let card : CaretakerContract; let player : Player; let game : Game;

  beforeEach(function() {
    card = new CaretakerContract();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Cannot play or act', function() {
    expect(player.canPlayIgnoringCost(card)).is.not.true;
    expect(card.canAct(player)).is.not.true;
  });

  it('Should play', function() {
    (game as any).temperature = 0;
    expect(player.canPlayIgnoringCost(card)).is.true;
  });

  it('Cannot act', function() {
    player.heat = 7;
    expect(card.canAct(player)).is.false;
    player.heat = 8;
    expect(card.canAct(player)).is.true;
  });
  it('Should act', function() {
    player.heat = 8;
    card.action(player);
    expect(player.heat).to.eq(0);
    expect(player.getTerraformRating()).to.eq(21);
  });

  it('Cannot act if cannot afford reds tax', function() {
    const player = TestPlayers.BLUE.newPlayer();
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    player.heat = 8;
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canAct(player)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    expect(card.canAct(player)).is.false;

    player.megaCredits = 2;
    expect(card.canAct(player)).is.false;
    player.megaCredits = 3;
    expect(card.canAct(player)).is.true;
  });

  it('Do not double-account heat with Helion using Reds tax', function() {
    const player = TestPlayers.BLUE.newPlayer();
    player.corporationCard = new Helion();
    player.corporationCard.play(player);
    const game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions());
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);

    player.megaCredits = 3;
    player.heat = 8;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 0;
    player.heat = 11;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 0;
    player.heat = 8;
    expect(card.canAct(player)).is.false;
  });

  it('Can use Stormcraft Incorporated', function() {
    player.corporationCard = new StormCraftIncorporated();
    player.corporationCard.play(player);
    player.corporationCard.resourceCount = 3;
    player.heat = 1;
    expect(card.canAct(player)).is.false;
    player.heat = 2;
    expect(card.canAct(player)).is.true;
  });
});
