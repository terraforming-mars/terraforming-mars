import {expect} from 'chai';
import {SelectCard} from '../../src/server/inputs/SelectCard';
import {AquiferPumping} from '../../src/server/cards/base/AquiferPumping';
import {RoboticWorkforce} from '../../src/server/cards/base/RoboticWorkforce';
import {IoMiningIndustries} from '../../src/server/cards/base/IoMiningIndustries';
import {TestPlayer} from '../TestPlayer';
import {ICard} from '../../src/server/cards/ICard';

describe('SelectCard', function() {
  it('Throws error when selected card was not enabled', function() {
    const player = TestPlayer.BLUE.newPlayer();
    const cbArray: ICard[][] = [];

    const cards = [new AquiferPumping(), new RoboticWorkforce(), new IoMiningIndustries()];
    const selectCards = new SelectCard(
      'Select card',
      'Save',
      cards,
      (_cards) => {
        cbArray.push(_cards);
        return undefined;
      },
      {enabled: [true, false, true]},
    );

    player.runInput([[cards[0].name]], selectCards);
    expect(cbArray).to.has.length(1);

    player.runInput([[cards[2].name]], selectCards);
    expect(cbArray).to.has.length(2);

    expect(() => player.runInput([[cards[1].name]], selectCards)).to.throw(Error, /Selected unavailable card/);
  });
});

