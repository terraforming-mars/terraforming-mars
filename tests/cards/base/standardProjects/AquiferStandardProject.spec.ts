import {expect} from 'chai';
import {churnAction} from '../../../TestingUtils';
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
    player.megaCredits = card.cost - 1;
    expect(card.canAct(player)).is.false;
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
  });

  it('action', function() {
    player.megaCredits = card.cost;
    player.setTerraformRating(20);
    expect(game.board.getOceanSpaces()).is.empty;

    UnderworldTestHelper.assertPlaceOcean(player, churnAction(card, player));

    expect(player.getTerraformRating()).eq(21);
    expect(game.board.getOceanSpaces()).has.length(1);
  });

  it('cannnot act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    maxOutOceans(player);
    expect(card.canAct(player)).is.false;
  });

  it('Can not act with reds', () => {
    [game, player] = testGame(1, {turmoilExtension: true});

    player.megaCredits = card.cost;
    player.game.phase = Phase.ACTION;
    player.game.turmoil!.rulingParty = new Reds();
    PoliticalAgendas.setNextAgenda(player.game.turmoil!, player.game);
    expect(card.canAct(player)).eq(false);
    player.megaCredits = card.cost + 2;
    expect(card.canAct(player)).eq(false);
    player.megaCredits = card.cost + 3;
    expect(card.canAct(player)).eq(true);
  });
});
