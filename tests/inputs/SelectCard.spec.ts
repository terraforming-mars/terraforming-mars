import {expect} from 'chai';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {AquiferPumping} from '../../src/server/cards/base/AquiferPumping';
import {RoboticWorkforce} from '../../src/server/cards/base/RoboticWorkforce';
import {IoMiningIndustries} from '../../src/server/cards/base/IoMiningIndustries';
import {ICard} from '../../src/server/cards/ICard';
import {CardName} from '../../src/common/cards/CardName';

describe('SelectCard', () => {
  let aquiferPumping: ICard;
  let roboticWorkforce: ICard;
  let ioMiningIndustries: ICard;
  let selected: ReadonlyArray<ICard>;
  const cb = (cards: ReadonlyArray<ICard>) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    aquiferPumping = new AquiferPumping();
    roboticWorkforce = new RoboticWorkforce();
    ioMiningIndustries = new IoMiningIndustries();
    selected = [];
  });

  it('Simple', () => {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, ioMiningIndustries])
      .andThen(cb);

    selectCards.process({type: 'card', cards: [CardName.AQUIFER_PUMPING]});
    expect(selected).deep.eq([aquiferPumping]);

    selectCards.process({type: 'card', cards: [CardName.IO_MINING_INDUSTRIES]});
    expect(selected).deep.eq([ioMiningIndustries]);
  });

  it('Cannot select unavailable card', () => {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, roboticWorkforce])
      .andThen(cb);

    expect(() => selectCards.process({type: 'card', cards: [CardName.DIRECTED_IMPACTORS]}))
      .to.throw(Error, /Card Directed Impactors not found/);
  });

  it('Throws error when selected card was not enabled', () => {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, roboticWorkforce, ioMiningIndustries],
      {enabled: [true, false, true]})
      .andThen(cb);

    selectCards.process({type: 'card', cards: [CardName.AQUIFER_PUMPING]});
    expect(selected).deep.eq([aquiferPumping]);

    selectCards.process({type: 'card', cards: [CardName.IO_MINING_INDUSTRIES]});
    expect(selected).deep.eq([ioMiningIndustries]);

    expect(() => selectCards.process({type: 'card', cards: [CardName.ROBOTIC_WORKFORCE]}))
      .to.throw(Error, /Robotic Workforce is not available/);
  });
});

