import {expect} from 'chai';
import {Ants} from '../../src/server/cards/base/Ants';
import {GHGProducingBacteria} from '../../src/server/cards/base/GHGProducingBacteria';
import {Tardigrades} from '../../src/server/cards/base/Tardigrades';
import {AddResourcesToCards} from '../../src/server/deferredActions/AddResourcesToCards';
import {TestPlayer} from '../TestPlayer';
import {CardResource} from '../../src/common/CardResource';
import {AndOptions} from '../../src/server/inputs/AndOptions';
import {cast, testGame} from '../TestingUtils';

describe('AddResourcesToCards', () => {
  let player: TestPlayer;
  let ghgProducingBacteria: GHGProducingBacteria;
  let tardigrades: Tardigrades;
  let ants: Ants;

  beforeEach(() => {
    [/* game */, player] = testGame(1);
    ghgProducingBacteria = new GHGProducingBacteria();
    tardigrades = new Tardigrades();
    ants = new Ants();
  });

  it('0 cards in hand no action', () => {
    const action = new AddResourcesToCards(player, CardResource.MICROBE, 5);
    expect(action.execute()).is.undefined;
  });

  it('0 resources no action', () => {
    player.playedCards.push(ghgProducingBacteria);
    const action = new AddResourcesToCards(player, CardResource.MICROBE, 0);
    expect(action.execute()).is.undefined;
  });

  it('one card autofill', () => {
    player.playedCards.push(ghgProducingBacteria);
    const options = new AddResourcesToCards(player, CardResource.MICROBE, 5).execute();
    expect(options).is.undefined;
    expect(ghgProducingBacteria.resourceCount).eq(5);
  });

  it('many microbe cards', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    const options = cast(new AddResourcesToCards(player, CardResource.MICROBE, 9).execute(), AndOptions);

    expect(options.options).has.length(3);
    options.options[0].cb(1);
    options.options[1].cb(3);
    options.options[2].cb(5);
    options.cb(undefined);

    expect(ghgProducingBacteria.resourceCount).eq(1);
    expect(tardigrades.resourceCount).eq(3);
    expect(ants.resourceCount).eq(5);
  });

  it('many microbe cards, wrong input', () => {
    player.playedCards.push(ghgProducingBacteria, tardigrades, ants);

    const options = cast(new AddResourcesToCards(player, CardResource.MICROBE, 9).execute(), AndOptions);

    expect(options.options).has.length(3);

    options.options[0].cb(1);
    options.options[1].cb(3);
    options.options[2].cb(6);
    expect(() => options.cb(undefined)).to.throw(/Expecting 9 .*, got 10/);

    options?.options[2].cb(4);
    expect(() => options.cb(undefined)).to.throw(/Expecting 9 .*, got 8/);
  });
});
