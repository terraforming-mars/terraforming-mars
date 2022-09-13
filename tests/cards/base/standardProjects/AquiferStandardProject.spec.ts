import {expect} from 'chai';
import {cast} from '../../../TestingUtils';
import {AquiferStandardProject} from '../../../../src/server/cards/base/standardProjects/AquiferStandardProject';
import {maxOutOceans, testGameOptions, runAllActions} from '../../../TestingUtils';
import {TestPlayer} from '../../../TestPlayer';
import {Game} from '../../../../src/server/Game';
import {PoliticalAgendas} from '../../../../src/server/turmoil/PoliticalAgendas';
import {Reds} from '../../../../src/server/turmoil/parties/Reds';
import {Phase} from '../../../../src/common/Phase';
import {SelectSpace} from '../../../../src/server/inputs/SelectSpace';
import {SpaceType} from '../../../../src/common/boards/SpaceType';
import {TileType} from '../../../../src/common/TileType';

describe('AquiferStandardProject', function() {
  let card: AquiferStandardProject;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new AquiferStandardProject();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
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
    expect(game.board.getOceanCount()).eq(0);

    card.action(player);
    runAllActions(game);

    const selectSpace = cast(player.getWaitingFor(), SelectSpace);
    const availableSpace = selectSpace.availableSpaces[0];

    expect(availableSpace.spaceType).eq(SpaceType.OCEAN);

    selectSpace?.cb(availableSpace);

    expect(availableSpace.tile!.tileType).eq(TileType.OCEAN);
    expect(player.getTerraformRating()).eq(21);
    expect(game.board.getOceanCount()).eq(1);
  });

  it('cannnot act when maximized', () => {
    player.megaCredits = card.cost;
    expect(card.canAct(player)).is.true;
    maxOutOceans(player);
    expect(card.canAct(player)).is.false;
  });

  it('Can not act with reds', () => {
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player, testGameOptions({turmoilExtension: true}));

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
