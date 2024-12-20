import {expect} from 'chai';
import {AquiferPumping, OCEAN_COST} from '../../../src/server/cards/base/AquiferPumping';
import {IGame} from '../../../src/server/IGame';
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
  let game: IGame;

  beforeEach(function() {
    card = new AquiferPumping();
    [game, player] = testGame(2);
  });

  it('Should play', function() {
    cast(card.play(player), undefined);
  });

  it('Should act', function() {
    player.megaCredits = OCEAN_COST;
    const action = card.action(player);
    cast(action, undefined);
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
    [game, player] = testGame(1, {turmoilExtension: true});
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
    [game, player] = testGame(1, {turmoilExtension: true});
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
