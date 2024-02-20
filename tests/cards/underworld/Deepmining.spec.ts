import {expect} from 'chai';
import {Deepmining} from '../../../src/server/cards/underworld/Deepmining';
import {Game} from '../../../src/server/Game';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {TestPlayer} from '../../TestPlayer';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Deepmining', function() {
  let card: Deepmining;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new Deepmining();
    [game, player] = testGame(2);
  });

  it('Cannot play', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', function() {
    for (const space of game.board.getAvailableSpacesOnLand(player)) {
      if (space.bonus.includes(SpaceBonus.STEEL) || space.bonus.includes(SpaceBonus.TITANIUM)) {
        space.undergroundResources = 'nothing';
      }
    }

    const action = cast(card.play(player), SelectSpace);

    const titaniumSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) && space.bonus.includes(SpaceBonus.STEEL) === false)!;
    expect(titaniumSpace.bonus).contains(SpaceBonus.TITANIUM);
    expect(titaniumSpace.bonus).does.not.contain(SpaceBonus.STEEL);

    action.cb(titaniumSpace);
    runAllActions(game);

    expect(titaniumSpace.player).to.be.undefined;
    expect(titaniumSpace.tile).is.undefined;
    expect(player.production.titanium).to.eq(1);
    expect(titaniumSpace.adjacency?.bonus).eq(undefined);

    const steelSpace = action.spaces.find((space) => space.bonus.includes(SpaceBonus.TITANIUM) === false && space.bonus.includes(SpaceBonus.STEEL))!;
    expect(steelSpace.bonus).contains(SpaceBonus.STEEL);

    action.cb(steelSpace);
    runAllActions(game);

    expect(steelSpace.player).is.undefined;
    expect(steelSpace.tile).is.undefined;
    expect(player.production.steel).to.eq(1);
    expect(steelSpace.adjacency?.bonus).eq(undefined);
  });
});
