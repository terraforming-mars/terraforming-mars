import {expect} from 'chai';
import {BotanicalExperience} from '../../../src/server/cards/pathfinders/BotanicalExperience';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {Space} from '../../../src/server/boards/Space';
import {TileType} from '../../../src/common/TileType';
import {Resource} from '../../../src/common/Resource';
import {StealResources} from '../../../src/server/deferredActions/StealResources';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {RemoveAnyPlants} from '../../../src/server/deferredActions/RemoveAnyPlants';

describe('BotanicalExperience', () => {
  let card: BotanicalExperience;
  let player: TestPlayer;
  let otherPlayer: TestPlayer;
  let game: IGame;
  let space: Space;

  beforeEach(() => {
    card = new BotanicalExperience();
    [game, player, otherPlayer] = testGame(2);
    space = game.board.getAvailableSpacesForGreenery(otherPlayer)[0];
  });

  it('canPlay', () => {
    expect(card.canPlay(player)).is.false;

    game.addGreenery(otherPlayer, space);

    expect(card.canPlay(player)).is.true;
  });

  it('onTilePlaced', () => {
    player.playedCards.push(card);

    expect(card.resourceCount).eq(0);

    // Space is empty
    card.onTilePlaced(player, player, space);
    expect(card.resourceCount).eq(0);
    space.tile = {tileType: TileType.OCEAN};
    card.onTilePlaced(player, player, space);
    expect(card.resourceCount).eq(0);

    space.tile = {tileType: TileType.GREENERY};
    card.onTilePlaced(player, player, space);
    expect(card.resourceCount).eq(1);

    space.tile = {tileType: TileType.WETLANDS};
    card.onTilePlaced(player, player, space);
    expect(card.resourceCount).eq(2);

    expect(player.production.plants).eq(0);
    space.tile = {tileType: TileType.GREENERY};
    card.onTilePlaced(player, player, space);
    expect(card.resourceCount).eq(0);
    expect(player.production.plants).eq(1);
  });

  it('card.addResourceTo', () => {
    player.playedCards.push(card);
    card.resourceCount = 2;
    expect(player.production.plants).eq(0);
    player.addResourceTo(card, 8);
    expect(card.resourceCount).eq(1);
    expect(player.production.plants).eq(3);
  });

  it('targeted to remove plants', () => {
    player.plants = 7;
    player.playedCards.push(card);
    game.defer(new RemoveAnyPlants(otherPlayer, 5));
    runAllActions(game);
    const orOptions = cast(otherPlayer.getWaitingFor(), OrOptions);

    expect(otherPlayer.plants).eq(0);

    orOptions.options[0].cb();

    expect(player.plants).eq(4);
  });

  it('targeted to steal plants', () => {
    player.plants = 7;
    player.playedCards.push(card);
    game.defer(new StealResources(otherPlayer, Resource.PLANTS, 5));
    runAllActions(game);
    const orOptions = cast(otherPlayer.getWaitingFor(), OrOptions);

    expect(otherPlayer.plants).eq(0);

    orOptions.options[0].cb();

    expect(player.plants).eq(4);
    expect(otherPlayer.plants).eq(3);
  });

  it('does not imapct other resource types', () => {
    player.megaCredits = 7;
    player.playedCards.push(card);
    game.defer(new StealResources(otherPlayer, Resource.MEGACREDITS, 5));
    runAllActions(game);
    const orOptions = cast(otherPlayer.getWaitingFor(), OrOptions);

    expect(otherPlayer.megaCredits).eq(0);

    orOptions.options[0].cb();

    expect(player.megaCredits).eq(2);
    expect(otherPlayer.megaCredits).eq(5);
  });
});
