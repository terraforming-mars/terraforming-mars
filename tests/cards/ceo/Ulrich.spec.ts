import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {forceGenerationEnd, maxOutOceans} from '../../TestingUtils';
import {testGame} from '../../TestGame';
import {TestPlayer} from '../../TestPlayer';
import {Ulrich} from '../../../src/server/cards/ceos/Ulrich';

describe('Ulrich', function() {
  let card: Ulrich;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new Ulrich();
    [game, player, player2] = testGame(2, {ceoExtension: true});
  });

  it('Can act', function() {
    expect(card.canAct(player)).is.true;
  });

  it('Takes action: Some Oceans Placed, 4MC per Ocean', function() {
    const oceansPlaced = 5;
    maxOutOceans(player2, oceansPlaced);
    card.action(player);
    expect(player.megaCredits).eq(oceansPlaced * 4);
  });

  it('Takes action: All oceans placed - gain only 15 M€', function() {
    maxOutOceans(player2);
    card.action(player);
    expect(player.megaCredits).eq(15);
  });

  it('Can only act once per game', function() {
    card.action(player);
    forceGenerationEnd(game);
    expect(card.isDisabled).is.true;
    expect(card.canAct(player)).is.false;
  });
});
