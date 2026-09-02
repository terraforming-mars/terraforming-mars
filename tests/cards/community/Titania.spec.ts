import {expect} from 'chai';
import {Titania} from '../../../src/server/cards/community/Titania';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {runAllActions} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('Titania', () => {
  let titania: Titania;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    titania = new Titania();
    [game, player, player2] = testGame(2, {coloniesExtension: true});
    game.colonies.push(titania);
  });

  it('build', () => {
    expect(player.colonies.getVictoryPoints()).eq(0);
    expect(player.getVictoryPoints().total).eq(20);
    titania.addColony(player);
    expect(player.colonies.getVictoryPoints()).eq(5);
    expect(player.getVictoryPoints().total).eq(25);
    titania.addColony(player);
    expect(player.colonies.getVictoryPoints()).eq(8);
    expect(player.getVictoryPoints().total).eq(28);
  });

  it('Should trade + bonus', () => {
    titania.colonies.push(player.id);
    titania.colonies.push(player2.id);
    player.megaCredits = 10;
    player2.megaCredits = 1;
    titania.trackPosition = 2;
    expect(player.getVictoryPoints().total).eq(20);
    titania.trade(player);
    runAllActions(game);
    expect(player.getVictoryPoints().total).eq(22);
    expect(player.megaCredits).eq(7);
    expect(player2.megaCredits).eq(0);
  });
});
