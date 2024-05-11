import {expect} from 'chai';
import {AICentral} from '../../../src/server/cards/base/AICentral';
import {Ants} from '../../../src/server/cards/base/Ants';
import {BiofertilizerFacility} from '../../../src/server/cards/ares/BiofertilizerFacility';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {IGame} from '../../../src/server/IGame';
import {SpaceBonus} from '../../../src/common/boards/SpaceBonus';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {cast, runAllActions} from '../../TestingUtils';

describe('BiofertilizerFacility', function() {
  let card: BiofertilizerFacility;
  let player: TestPlayer;
  let game: IGame;

  let scienceTagCard: IProjectCard = new AICentral();
  let microbeHost: IProjectCard = new Ants();

  beforeEach(function() {
    card = new BiofertilizerFacility();
    [game, player] = testGame(2, {aresExtension: true});
    scienceTagCard = new AICentral();
    microbeHost = new Ants();
  });

  it('Cannot play without a science tag', function() {
    expect(card.canPlay(player)).is.not.true;
  });

  it('Play', function() {
    // Set up the cards.
    // Adds the necessary Science tag.
    player.playCard(scienceTagCard);
    player.playCard(microbeHost);

    // Initial expectations that will change after playing the card.
    expect(player.production.plants).is.eq(0);
    expect(microbeHost.resourceCount).is.eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    expect(card.canPlay(player)).is.true;
    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    expect(player.production.plants).is.eq(1);

    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    action.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.BIOFERTILIZER_FACILITY);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]});

    game.deferredActions.peek()!.execute();

    expect(microbeHost.resourceCount).is.eq(2);
  });
});
