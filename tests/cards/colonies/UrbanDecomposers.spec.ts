import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {UrbanDecomposers} from '../../../src/server/cards/colonies/UrbanDecomposers';
import {ICard} from '../../../src/server/cards/ICard';
import {Luna} from '../../../src/server/colonies/Luna';
import {Game} from '../../../src/server/Game';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {Player} from '../../../src/server/Player';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('UrbanDecomposers', function() {
  let card: UrbanDecomposers;
  let player: Player;
  let game: Game;
  let luna: Luna;

  beforeEach(function() {
    card = new UrbanDecomposers();
    player = TestPlayer.BLUE.newPlayer();
    const redPlayer = TestPlayer.RED.newPlayer();
    game = Game.newInstance('gameid', [player, redPlayer], player);
    luna = new Luna();
    game.colonies.push(luna);
  });

  it('Can not play if player has no city', function() {
    luna.colonies.push(player.id);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if player has no colony', function() {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    lands[0].player = player;
    lands[0].tile = {tileType: TileType.CITY};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play without targets', function() {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    lands[0].player = player;
    lands[0].tile = {tileType: TileType.CITY};

    luna.colonies.push(player.id);

    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });

  it('Should play with single target', function() {
    const decomposers = new Decomposers();
    player.playedCards.push(decomposers);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);
    const input = game.deferredActions.peek()!.execute();
    game.deferredActions.pop();
    expect(input).is.undefined;
    expect(decomposers.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
  });

  it('Should play with multiple targets', function() {
    const decomposers = new Decomposers();
    const ants = new Ants();
    player.playedCards.push(decomposers, ants);

    card.play(player);
    expect(game.deferredActions).has.lengthOf(1);

    // add two microbes to Ants
    const selectCard = cast(game.deferredActions.peek()!.execute(), SelectCard<ICard>);
    selectCard.cb([ants]);
    expect(ants.resourceCount).to.eq(2);
    expect(player.production.plants).to.eq(1);
  });
});
