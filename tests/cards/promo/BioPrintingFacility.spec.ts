import {expect} from 'chai';
import {SmallAnimals} from '../../../src/server/cards/base/SmallAnimals';
import {BioPrintingFacility} from '../../../src/server/cards/promo/BioPrintingFacility';
import {Fish} from '../../../src/server/cards/base/Fish';
import {testGame} from '../../TestGame';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {TestPlayer} from '../../TestPlayer';
import {cast} from '../../TestingUtils';

describe('BioPrintingFacility', () => {
  let card: BioPrintingFacility;
  let player: TestPlayer;

  beforeEach(() => {
    card = new BioPrintingFacility();
    [/* game */, player] = testGame(2);
    player.playedCards.push(card);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);
  });


  it('Can not act', () => {
    player.energy = 1;
    expect(card.canAct(player)).is.not.true;
  });

  it('Can act', () => {
    player.energy = 3;
    expect(card.canAct(player));
  });

  it('Should act - single target', () => {
    const smallanimals = new SmallAnimals();
    player.playedCards.push(smallanimals);
    player.energy = 2;

    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb();
    expect(smallanimals.resourceCount).to.eq(1);

    action.options[1].cb();
    expect(player.plants).to.eq(2);
  });

  it('Should act - multiple targets', () => {
    const smallanimals = new SmallAnimals();
    const fish = new Fish();
    player.playedCards.push(smallanimals, fish);
    player.energy = 2;

    const action = cast(card.action(player), OrOptions);
    expect(action.options).has.lengthOf(2);

    action.options[0].cb([smallanimals]);
    expect(smallanimals.resourceCount).to.eq(1);

    action.options[0].cb([fish]);
    expect(fish.resourceCount).to.eq(1);
  });
});
