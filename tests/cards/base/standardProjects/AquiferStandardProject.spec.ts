import {expect} from 'chai';
import {cast, churnAction, runAllActions} from '../../../TestingUtils';
import {AquiferStandardProject} from '../../../../src/server/cards/base/standardProjects/AquiferStandardProject';
import {maxOutOceans} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../../src/common/Phase';
import {testGame} from '../../../TestGame';
import {UnderworldTestHelper} from '../../../underworld/UnderworldTestHelper';

describe('AquiferStandardProject', function() {
  let card: AquiferStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AquiferStandardProject();
    [game, player] = testGame(1);
  });

  it('Can act', function() {
    player.stock.megacredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.stock.megacredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.stock.megacredits = card.cost;
    player.setTerraformRating(20);
    expect(game.board.getOceanSpaces()).is.empty;

    UnderworldTestHelper.assertPlaceOcean(player, churnAction(card, player));

    expect(player.getTerraformRating()).eq(21);
    expect(game.board.getOceanSpaces()).has.length(1);
  });

  it('Paying when the global parameter is at its goal is a valid stall action', () => {
    player.stock.megacredits = 18;
    expect(card.canAct(player)).eq(true);

    maxOutOceans(player);

    player.stock.megacredits = 18;
    expect(player.getTerraformRating()).eq(23);
    expect(card.canAct(player)).eq(true);

    cast(card.action(player), undefined);
    runAllActions(game);

    expect(game.board.getOceanSpaces()).has.length(9);
    expect(player.getTerraformRating()).eq(23);
    expect(player.stock.megacredits).eq(0);
  });

  it('Can not act with reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});

    player.stock.megacredits = card.cost;
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.stock.megacredits = card.cost + 2;
    expect(card.canAct(player)).eq(false);
    player.stock.megacredits = card.cost + 3;
    expect(card.canAct(player)).eq(true);
  });
});
