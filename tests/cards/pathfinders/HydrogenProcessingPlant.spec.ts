import {expect} from 'chai';
import {HydrogenProcessingPlant} from '../../../src/server/cards/pathfinders/HydrogenProcessingPlant';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {addOcean, setOxygenLevel, testGame} from '../../TestingUtils';
import {Units} from '../../../src/common/Units';

describe('HydrogenProcessingPlant', () => {
  let card: HydrogenProcessingPlant;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new HydrogenProcessingPlant();
    [game, player] = testGame(1);
    player.playedCards.push(card);
  });

  it('canPlay', () => {
    setOxygenLevel(game, 2);
    expect(card.canPlay(player)).is.false;

    setOxygenLevel(game, 3);
    expect(card.canPlay(player)).is.true;
  });

  it('play', () => {
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    game.increaseOxygenLevel(player, 1);
    expect(game.getOxygenLevel()).eq(3);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    addOcean(player);
    expect(player.production.asUnits()).deep.eq(Units.EMPTY);

    card.play(player);

    expect(game.getOxygenLevel()).eq(2);
    expect(player.production.asUnits()).deep.eq(Units.of({energy: 3}));
  });
});

