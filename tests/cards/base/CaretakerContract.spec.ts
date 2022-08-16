import {expect} from 'chai';
import {CaretakerContract} from '../../../src/server/cards/base/CaretakerContract';
import {Game} from '../../../src/server/Game';
import {setCustomGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {Helion} from '../../../src/server/cards/corporation/Helion';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';

describe('CaretakerContract', function() {
  let card: CaretakerContract;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new CaretakerContract();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
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
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, setCustomGameOptions());
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
    const player = TestPlayer.BLUE.newPlayer();
    const helion = new Helion();
    player.setCorporationForTest(helion);
    helion.play(player);
    const game = Game.newInstance('gameid', [player], player, setCustomGameOptions());
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
    const stormcraft = new StormCraftIncorporated();
    player.setCorporationForTest(stormcraft);
    stormcraft.play();
    stormcraft.resourceCount = 3;
    player.heat = 1;
    expect(card.canAct(player)).is.false;
    player.heat = 2;
    expect(card.canAct(player)).is.true;
  });
});
