import {expect} from 'chai';
import {ArchaeBacteria} from '../../../src/server/cards/base/ArchaeBacteria';
import {TestPlayer} from '../../TestPlayer';
import {IGame} from '../../../src/server/IGame';
import {setTemperature} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('ArchaeBacteria', () => {
  let card: ArchaeBacteria;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ArchaeBacteria();
    [game, player] = testGame(2);
  });

  it('Can not play', () => {
    setTemperature(game, -12);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Should play', () => {
    card.play(player);
    expect(player.production.plants).to.eq(1);
  });
});
