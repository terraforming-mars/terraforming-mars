import {expect} from 'chai';
import {AquiferPumping, OCEAN_COST} from '../../../src/server/cards/base/AquiferPumping';
import {Game} from '../../../src/server/Game';
import {cast, maxOutOceans} from '../../TestingUtils';
import {TestPlayer} from '../../TestPlayer';
import {Phase} from '../../../src/common/Phase';
import {Greens} from '../../../src/server/turmoil/parties/Greens';
import {Reds} from '../../../src/server/turmoil/parties/Reds';
import {PoliticalAgendas} from '../../../src/server/turmoil/PoliticalAgendas';
import {testGame} from '../../TestGame';

describe('AquiferPumping', function() {
  let card: AquiferPumping;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AquiferPumping();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    expect(card.play(player)).is.undefined;
  });

  it('Should act', function() {
    player.stock.megacredits = OCEAN_COST;
    const action = card.action(player);
    cast(action, undefined);
    game.deferredActions.runNext();
    expect(player.stock.megacredits).to.eq(0);
  });

  it('Cannot act if not enough to pay', function() {
    expect(card.canAct(player)).is.not.true;
  });

  it('Can use steel to pay', function() {
    player.stock.megacredits = OCEAN_COST - 2;
    expect(card.canAct(player)).is.not.true;
    player.stock.steel = 1;
    expect(card.canAct(player)).is.true;
  });

  it('Cannot act if cannot afford reds tax', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Greens();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.stock.megacredits = OCEAN_COST;
    expect(card.canAct(player)).is.true;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.stock.megacredits = OCEAN_COST;
    expect(card.canAct(player)).is.false;

    player.stock.megacredits = OCEAN_COST + 2;
    expect(card.canAct(player)).is.false;
    player.stock.megacredits = OCEAN_COST + 3;
    expect(card.canAct(player)).is.true;
  });

  it('Steel does not satisfy the reds tax', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const game = Game.newInstance('gameid', [player], player, {turmoilExtension: true});
    const turmoil = game.turmoil!;
    game.phase = Phase.ACTION;

    turmoil.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(turmoil, game);
    player.stock.megacredits = OCEAN_COST;
    expect(card.canAct(player)).is.false;

    player.stock.megacredits = 3;
    player.stock.steel = 4;
    expect(card.canAct(player)).is.true;

    player.stock.megacredits = 1;
    player.stock.steel = 5;
    expect(card.canAct(player)).is.false;
  });

  it('Can act if can pay even after oceans are maxed', function() {
    maxOutOceans(player);
    player.stock.megacredits = 8;

    expect(card.canAct(player)).is.true;
  });
});
