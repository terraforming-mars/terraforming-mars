import {expect} from 'chai';
import {setOxygenLevel} from '../../TestingUtils';
import {OzoneGenerators} from '../../../src/server/cards/pathfinders/OzoneGenerators';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestingUtils';

describe('OzoneGenerators', () => {
  let card: OzoneGenerators;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new OzoneGenerators();
    [game, player] = testGame(1);
  });

  it('canPlay', () => {
    setOxygenLevel(game, 5);
    player.megaCredits = card.cost;
    expect(player.canPlay(card)).is.false;
    setOxygenLevel(game, 6);
    expect(player.canPlay(card)).is.true;
  });

  it('canAct', () => {
    player.energy = 2;
    expect(card.canAct(player)).is.false;
    player.energy = 3;
    expect(card.canAct(player)).is.true;
  });

  it('action', () => {
    expect(player.getTerraformRating()).eq(14);
    player.energy = 3;
    card.action(player);
    expect(player.getTerraformRating()).eq(15);
    expect(player.energy).eq(0);
  });
});
