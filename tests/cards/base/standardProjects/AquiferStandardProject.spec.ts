import {expect} from 'chai';
import {AquiferStandardProject} from '../../../../src/cards/base/standardProjects/AquiferStandardProject';
import {TestingUtils} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/Game';
import {TestPlayers} from '../../../TestPlayers';
import {PoliticalAgendas} from '../../../../src/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/turmoil/parties/Reds';
import {Phase} from '../../../../src/Phase';
import {SelectSpace} from '../../../../src/inputs/SelectSpace';
import {SpaceType} from '../../../../src/SpaceType';
import {TileType} from '../../../../src/TileType';

describe('AquiferStandardProject', function() {
  let card: AquiferStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AquiferStandardProject();
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
    expect(game.board.getOceansOnBoard()).eq(0);

    card.action(player);
    TestingUtils.runAllActions(game);

    const selectSpace = player.getWaitingFor() as SelectSpace;
    const availableSpace = selectSpace.availableSpaces[0];

    expect(availableSpace.spaceType).eq(SpaceType.OCEAN);

    selectSpace?.cb(availableSpace);

    expect(availableSpace.tile!.tileType).eq(TileType.OCEAN);
    expect(player.getTerraformRating()).eq(21);
    expect(game.board.getOceansOnBoard()).eq(1);
  });

  it('cannnot act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    TestingUtils.maxOutOceans(player);
    expect(card.canAct(player)).is.false;
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
