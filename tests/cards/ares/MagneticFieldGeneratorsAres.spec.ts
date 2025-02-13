import {expect} from 'chai';
import {MagneticFieldGeneratorsAres} from '../../../src/server/cards/ares/MagneticFieldGeneratorsAres';
import {IGame} from '../../../src/server/IGame';
import {SelectSpace} from '../../../src/server/inputs/SelectSpace';
import {Resource} from '../../../src/common/Resource';
import {TestPlayer} from '../../TestPlayer';
import {cast, runAllActions, fakeCard} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {CardName} from '../../../src/common/cards/CardName';
import {CardResource} from '../../../src/common/CardResource';

describe('MagneticFieldGeneratorsAres', () => {
  let card: MagneticFieldGeneratorsAres;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new MagneticFieldGeneratorsAres();
    [game, player] = testGame(2, {aresExtension: true});
  });

  it('Cannot play without enough energy production', () => {
    player.production.add(Resource.ENERGY, 3);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Play and Adjacency Bonus Grants', () => {
    const microbeCard = fakeCard({name: 'microbeCard' as CardName, resourceType: CardResource.MICROBE});
    const dataCard = fakeCard({name: 'dataCard' as CardName, resourceType: CardResource.DATA});
    player.playedCards = [microbeCard, dataCard];

    player.production.add(Resource.ENERGY, 4);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    const action = cast(player.popWaitingFor(), SelectSpace);
    const space = action.spaces[0];
    action.cb(space);
    expect(player.production.energy).to.eq(0);
    expect(player.production.plants).to.eq(2);
    expect(player.getTerraformRating()).to.eq(23);

    player.megaCredits = 0;
    player.plants = 0;

    const adjacentSpaces = game.board.getAdjacentSpaces(space);
    adjacentSpaces[0].bonus = []; // Just in case it had plant bonuses
    game.addGreenery(player, adjacentSpaces[0]);
    runAllActions(game);

    expect(player.megaCredits).eq(1); // For Ares tile owner bonus
    expect(player.plants).eq(1);
    expect(microbeCard.resourceCount).eq(1);
  });
});
