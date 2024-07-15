import {expect} from 'chai';
import {SoilStudies} from '../../../src/server/cards/prelude2/SoilStudies';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {setTemperature} from '../../TestingUtils';
import {Luna} from '../../../src/server/colonies/Luna';
import {testGame} from '../../TestGame';

describe('SoilStudies', function() {
  let card: SoilStudies; 
  let player: TestPlayer; 
  let game: IGame;

  beforeEach(() => {
    card = new SoilStudies();
    [game, player] = testGame(1);
  });

  it('Can not play', function() {
    setTemperature(game, -2);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Play', function() {
    player.tagsForTest = {venus: 4, plant: 2, microbe: 2, wild: 1};
    const colony1 = new Luna();
    colony1.colonies.push(player.id);
    game.colonies.push(colony1);

    card.play(player);
    expect(player.plants).eq(9);
  });
});