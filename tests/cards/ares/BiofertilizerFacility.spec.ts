import {expect} from 'chai';
import {AICentral} from '../../../src/cards/base/AICentral';
import {Ants} from '../../../src/cards/base/Ants';
import {BiofertilizerFacility} from '../../../src/cards/ares/BiofertilizerFacility';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {SpaceBonus} from '../../../src/SpaceBonus';
import {TileType} from '../../../src/TileType';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('BiofertilizerFacility', function() {
  let card : BiofertilizerFacility; let player : Player; let game : Game;

  let scienceTagCard: IProjectCard = new AICentral();
  let microbeHost: IProjectCard = new Ants();

  beforeEach(function() {
    card = new BiofertilizerFacility();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player, ARES_OPTIONS_NO_HAZARDS);
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
    expect(player.getProduction(Resources.PLANTS)).is.eq(0);
    expect(microbeHost.resourceCount || 0).is.eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    expect(card.canPlay(player)).is.true;
    const action = card.play(player);
    expect(player.getProduction(Resources.PLANTS)).is.eq(1);

    const citySpace = game.board.getAvailableSpacesForCity(player)[0];
    action.cb(citySpace);

    expect(citySpace.player).to.eq(player);
    expect(citySpace.tile!.tileType).to.eq(TileType.BIOFERTILIZER_FACILITY);
    expect(citySpace.adjacency).to.deep.eq({bonus: [SpaceBonus.PLANT, SpaceBonus.MICROBE]});

    game.deferredActions.peek()!.execute();

    expect(microbeHost.resourceCount).is.eq(2);
  });
});
