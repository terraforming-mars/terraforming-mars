import {expect} from 'chai';
import {BioSol} from '../../../src/server/cards/pathfinders/BioSol';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {newTestGame, getTestPlayer} from '../../TestGame';
import {Tag} from '../../../src/common/cards/Tag';
import {runAllActions} from '../../TestingUtils';

describe('BioSol', function() {
  let card: BioSol;
  let player: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new BioSol();
    game = newTestGame(1);
    player = getTestPlayer(game, 0);
    player.setCorporationForTest(card);
  });

  it('initialAction', function() {
    expect(player.cardsInHand).is.empty;
    card.initialAction(player);
    expect(player.cardsInHand).has.length(2);
    expect(player.cardsInHand.filter((card) => card.tags.includes(Tag.MICROBE))).has.length(2);
  });

  it('action', function() {
    card.action(player);
    runAllActions(game);
    expect(card.resourceCount).to.eq(1);
  });

  it('getVictoryPoints', () => {
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 2;
    expect(card.getVictoryPoints()).eq(0);
    card.resourceCount = 3;
    expect(card.getVictoryPoints()).eq(1);
  });
});
