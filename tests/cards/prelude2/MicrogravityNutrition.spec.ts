import {MicrogravityNutrition} from '../../../src/server/cards/prelude2/MicrogravityNutrition';
import {Luna} from '../../../src/server/colonies/Luna';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';
import {cast} from '../../TestingUtils';
import {expect} from 'chai';

describe('MicrogravityNutrition', () => {
  let card: MicrogravityNutrition;
  let player: TestPlayer;
  let game: IGame;
  let colony1: Luna;

  beforeEach(() => {
    card = new MicrogravityNutrition();
    [game, player/* , player2 */] = testGame(2, {coloniesExtension: true});

    colony1 = new Luna();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);
  });

  it('Should play without targets', () => {
    cast(card.play(player), undefined);
    expect(player.production.megacredits).to.eq(1);
  });
});
