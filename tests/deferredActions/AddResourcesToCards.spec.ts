import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {AddResourcesToCards} from '../../src/server/deferredActions/AddResourcesToCards';
import {Game} from '../../src/server/Game';
import {TestPlayer} from '../TestPlayer';
import {CardResource} from '../../src/common/CardResource';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {cast} from '../TestingUtils';

describe('AddResourcesToCards', function() {
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(function() {
    player = TestPlayer.BLUE.newPlayer();
    Game.newInstance('gameid', [player], player);
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

    const options = cast(new AddResourcesToCards(player, CardResource.MICROBE, 9).execute(), AndOptions);

    expect(options.options.length).eq(3);
    options.options[0].cb(1);
    options.options[1].cb(3);
    options.options[2].cb(5);
    options.cb();

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(3);
    expect(ants.resourceCount).eq(5);
  });

  it('many microbe cards, wrong input', function() {
    player.playedCards = [ghgProducingBacteria, tardigrades, ants];

    const options = cast(new AddResourcesToCards(player, CardResource.MICROBE, 9).execute(), AndOptions);

    expect(options.options.length).eq(3);

    options.options[0].cb(1);
    options.options[1].cb(3);
    options.options[2].cb(6);
    expect(() => options.cb()).to.throw(/Expecting 9 .*, got 10/);

    options?.options[2].cb(4);
    expect(() => options.cb()).to.throw(/Expecting 9 .*, got 8/);
  });
});
