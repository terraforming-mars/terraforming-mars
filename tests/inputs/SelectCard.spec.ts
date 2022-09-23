import {expect} from 'chai';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {AquiferPumping} from '../../src/server/cards/base/AquiferPumping';
import {RoboticWorkforce} from '../../src/server/cards/base/RoboticWorkforce';
import {IoMiningIndustries} from '../../src/server/cards/base/IoMiningIndustries';
import {TestPlayer} from '../TestPlayer';
import {ICard} from '../../src/server/cards/ICard';
import {CardName} from '../../src/common/cards/CardName';

describe('SelectCard', function() {
  let player: TestPlayer;
  let aquiferPumping: ICard;
  let roboticWorkforce: ICard;
  let ioMiningIndustries: ICard;
  let selected: Array<ICard>;
  const cb = (cards: Array<ICard>) => {
    selected = cards;
    return undefined;
  };

  beforeEach(() => {
    player = TestPlayer.BLUE.newPlayer();
    aquiferPumping = new AquiferPumping();
    roboticWorkforce = new RoboticWorkforce();
    ioMiningIndustries = new IoMiningIndustries();
    selected = [];
  });

  it('Simple', function() {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, ioMiningIndustries],
      cb,
    );

    player.runInput([[CardName.AQUIFER_PUMPING]], selectCards);
    expect(selected).deep.eq([aquiferPumping]);

    player.runInput([[CardName.IO_MINING_INDUSTRIES]], selectCards);
    expect(selected).deep.eq([ioMiningIndustries]);
  });

  it('Cannot select unavailable card', function() {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, roboticWorkforce],
      cb,
    );

    expect(() => player.runInput([[CardName.DIRECTED_IMPACTORS]], selectCards))
      .to.throw(Error, /Card Directed Impactors not found/);
  });

  it('Throws error when selected card was not enabled', function() {
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      [aquiferPumping, roboticWorkforce, ioMiningIndustries],
      cb,
      {enabled: [true, false, true]},
    );

    player.runInput([[CardName.AQUIFER_PUMPING]], selectCards);
    expect(selected).deep.eq([aquiferPumping]);

    player.runInput([[CardName.IO_MINING_INDUSTRIES]], selectCards);
    expect(selected).deep.eq([ioMiningIndustries]);

    expect(() => player.runInput([[CardName.ROBOTIC_WORKFORCE]], selectCards))
      .to.throw(Error, /Robotic Workforce is not available/);
  });
});

