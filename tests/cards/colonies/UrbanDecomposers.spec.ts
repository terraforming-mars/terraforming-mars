import {expect} from 'chai';
import {Ants} from '../../../src/server/cards/base/Ants';
import {Decomposers} from '../../../src/server/cards/base/Decomposers';
import {UrbanDecomposers} from '../../../src/server/cards/colonies/UrbanDecomposers';
import {ICard} from '../../../src/server/cards/ICard';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';
import {SelectCard} from '../../../src/server/inputs/SelectCard';
import {TileType} from '../../../src/common/TileType';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('UrbanDecomposers', () => {
  let card: UrbanDecomposers;
  let player: TestPlayer;
  let game: IGame;
  let luna: Luna;

  beforeEach(() => {
    card = new UrbanDecomposers();
    [game, player] = testGame(2);
    luna = new Luna();
    game.colonies.push(luna);
  });

  it('Can not play if player has no city', () => {
    luna.colonies.push(player.id);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can not play if player has no colony', () => {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    lands[0].player = player;
    lands[0].tile = {tileType: TileType.CITY};
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play without targets', () => {
    const lands = player.game.board.getAvailableSpacesOnLand(player);
    lands[0].player = player;
    lands[0].tile = {tileType: TileType.CITY};

    luna.colonies.push(player.id);

    expect(card.canPlay(player)).is.true;
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });

  it('Should play with single target', () => {
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

  it('Should play with multiple targets', () => {
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
