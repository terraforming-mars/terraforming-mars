import {expect} from 'chai';
import {GreeneryStandardProject} from '../../../../src/cards/base/standardProjects/GreeneryStandardProject';
import {TestingUtils} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/Game';
import {TestPlayers} from '../../../TestPlayers';
import {PoliticalAgendas} from '../../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/turmoil/parties/Reds';
import {Phase} from '../../../../src/Phase';
import {MAX_OXYGEN_LEVEL} from '../../../../src/constants';
import {SelectSpace} from '../../../../src/inputs/SelectSpace';
import {SpaceType} from '../../../../src/SpaceType';
import {TileType} from '../../../../src/TileType';

describe('GreeneryStandardProject', function() {
  let card: GreeneryStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new GreeneryStandardProject();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
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

    card.action(player);
    TestingUtils.runAllActions(game);

    const selectSpace = player.getWaitingFor() as SelectSpace;
    const availableSpace = selectSpace.availableSpaces[0];

    expect(availableSpace.spaceType).eq(SpaceType.LAND);

    selectSpace?.cb(availableSpace);

    expect(availableSpace.tile!.tileType).eq(TileType.GREENERY);

    expect(player.megaCredits).eq(0);
    expect(player.getTerraformRating()).eq(21);
    expect(game.getOxygenLevel()).eq(1);
  });

  it('can act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    (game as any).oxygenLevel = MAX_OXYGEN_LEVEL;
    // Players can still place greeneries even if the oxygen level is maximized
    expect(card.canAct(player)).is.true;
  });

  it('Can not act with reds', () => {
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player, TestingUtils.setCustomGameOptions({turmoilExtension: true}));

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
