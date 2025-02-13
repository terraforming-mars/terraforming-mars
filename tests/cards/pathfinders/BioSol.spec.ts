import {expect} from 'chai';
import {BioSol} from '../../../src/server/cards/pathfinders/BioSol';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {Tag} from '../../../src/common/cards/Tag';
import {runAllActions} from '../../TestingUtils';

describe('BioSol', () => {
  let card: BioSol;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new BioSol();
    [game, player] = testGame(1);
    player.corporations.push(card);
  });

  it('initialAction', () => {
    expect(player.cardsInHand).is.empty;
    player.deferInitialAction(card);
    runAllActions(game);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.MICROBE))).has.length(2);
  });

  it('action', () => {
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('getVictoryPoints', () => {
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints(player)).eq(0);
    card.resourceCount = 3;
    expect(card.getVictoryPoints(player)).eq(1);
  });
});
