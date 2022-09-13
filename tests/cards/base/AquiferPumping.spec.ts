import {expect} from 'chai';
import {AquiferPumping, OCEAN_COST} from '../../../src/server/cards/base/AquiferPumping';
import {Game} from '../../../src/server/Game';
import {Player} from '../../../src/server/Player';
import {maxOutOceans, testGameOptions} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';

describe('AquiferPumping', function() {
  let card: AquiferPumping;
  let player: Player;
  let game: Game;

  beforeEach(function() {
    card = new AquiferPumping();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
  });

  it('Should act', function() {
    player.megaCredits = OCEAN_COST;
    const action = card.action(player);
    expect(action).is.undefined;
    game.deferredActions.runNext();
    expect(player.megaCredits).to.eq(0);
  });

  it('Cannot act if not enough to pay', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can use steel to pay', function() {
    player.megaCredits = OCEAN_COST - 2;
    expect(card.canAct(player)).is.not.true;
    player.steel = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Cannot act if cannot afford reds tax', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = OCEAN_COST;
    expect(card.canAct(player)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = OCEAN_COST;
    expect(card.canAct(player)).is.false;

    player.megaCredits = OCEAN_COST + 2;
    expect(card.canAct(player)).is.false;
    player.megaCredits = OCEAN_COST + 3;
    expect(card.canAct(player)).is.true;
  });

  it('Steel does not satisfy the reds tax', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.megaCredits = OCEAN_COST;
    expect(card.canAct(player)).is.false;

    player.megaCredits = 3;
    player.steel = 4;
    expect(card.canAct(player)).is.true;

    player.megaCredits = 1;
    player.steel = 5;
    expect(card.canAct(player)).is.false;
  });

  it('Can act if can pay even after oceans are maxed', function() {
    maxOutOceans(player);
    player.megaCredits = 8;

    expect(card.canAct(player)).is.true;
  });
});
