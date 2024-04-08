import {expect} from 'chai';
import {churnAction, setOxygenLevel} from '../../../TestingUtils';
import {GreeneryStandardProject} from '../../../../src/server/cards/base/standardProjects/GreeneryStandardProject';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../../src/common/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../../src/common/constants';
import {TileType} from '../../../../src/common/TileType';
import {testGame} from '../../../TestGame';
import {UnderworldTestHelper} from '../../../underworld/UnderworldTestHelper';

describe('GreeneryStandardProject', function() {
  let card: GreeneryStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new GreeneryStandardProject();
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
    expect(game.getOxygenLevel()).eq(0);

    UnderworldTestHelper.assertPlaceTile(player, churnAction(card, player), TileType.GREENERY);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('can act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    setOxygenLevel(game, MAX_OXYGEN_LEVEL);
    // Players can still place greeneries even if the oxygen level is maximized
    expect(card.canAct(player)).is.true;
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
