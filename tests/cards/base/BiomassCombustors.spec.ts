import {expect} from 'chai';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {IGame} from '../../../src/server/IGame';
import {TestPlayer} from '../../TestPlayer';
import {Resource} from '../../../src/common/Resource';
import {cast, runAllActions, setOxygenLevel} from '../../TestingUtils';
import {testGame} from '../../TestGame';

describe('BiomassCombustors', function() {
  let card: BiomassCombustors;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(function() {
    card = new BiomassCombustors();
    [game, player, player2] = testGame(2);
  });

  it('Cannot play if oxygen requirement not met', function() {
    player2.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Cannot play if no one has plant production', function() {
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.not.true;
  });

  it('Can play in solo mode if oxygen requirement is met', function() {
    const [game, player] = testGame(1);
    setOxygenLevel(game, 6);
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', function() {
    setOxygenLevel(game, 6);
    player2.production.add(Resource.PLANTS, 1);
    expect(card.canPlay(player)).is.true;

    card.play(player);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);
    expect(player.production.energy).to.eq(2);
    expect(player2.production.plants).to.eq(0);

    expect(card.getVictoryPoints(player)).to.eq(-1);
  });
});
