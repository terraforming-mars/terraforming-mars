import {expect} from 'chai';
import {Ants} from '../../src/cards/base/Ants';
import {GHGProducingBacteria} from '../../src/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../src/cards/base/Tardigrades';
import {AddResourcesToCards} from '../../src/deferredActions/AddResourcesToCards';
import {Game} from '../../src/Game';
import {TestPlayers} from '../TestPlayers';
import {TestPlayer} from '../TestPlayer';
import {CardResource} from '../../src/common/CardResource';
import {AndOptions} from '../../src/inputs/AndOptions';

describe('AddResourcesToCards', function() {
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(function() {
    player = TestPlayers.BLUE.newPlayer();
    Game.newInstance('foobar', [player], player);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
  });

  it('0 cards in hand no action', function() {
    const action = new AddResourcesToCards(player, CardResource.MICROBE, 5);
    expect(action.execute()).is.undefined;
  });

  it('0 resources no action', function() {
    player.playedCards = [ghgProducingBacteria];
    const action = new AddResourcesToCards(player, CardResource.MICROBE, 0);
    expect(action.execute()).is.undefined;
  });

  it('one card autofill', function() {
    player.playedCards = [ghgProducingBacteria];
    const options = new AddResourcesToCards(player, CardResource.MICROBE, 5).execute();
    expect(options).is.undefined;
    expect(ghgProducingBacteria.resourceCount).eq(5);
  });

  it('many microbe cards', function() {
    player.playedCards = [ghgProducingBacteria, tardigrades, ants];

    const options = new AddResourcesToCards(player, CardResource.MICROBE, 9).execute();
    expect(options).instanceOf(AndOptions);

    if (options instanceof AndOptions) {
      expect(options.options.length).eq(3);
      options?.options[0].cb(1);
      options?.options[1].cb(3);
      options?.options[2].cb(5);
      options?.cb();

      expect(ghgProducingBacteria.resourceCount).eq(1);
      expect(tardigrades.resourceCount).eq(3);
      expect(ants.resourceCount).eq(5);
    }
  });

  it('many microbe cards, wrong input', function() {
    player.playedCards = [ghgProducingBacteria, tardigrades, ants];

    const options = new AddResourcesToCards(player, CardResource.MICROBE, 9).execute();
    expect(options).instanceOf(AndOptions);

    if (options instanceof AndOptions) {
      expect(options?.options.length).eq(3);

      options?.options[0].cb(1);
      options?.options[1].cb(3);
      options?.options[2].cb(6);
      expect(() => options?.cb()).to.throw(/Expecting 9 .*, got 10/);

      options?.options[2].cb(4);
      expect(() => options?.cb()).to.throw(/Expecting 9 .*, got 8/);
    }
  });
});
