import {expect} from 'chai';
import {SelectCard} from '../../src/inputs/SelectCard';
import {AquiferPumping} from '../../src/cards/base/AquiferPumping';
import {RoboticWorkforce} from '../../src/cards/base/RoboticWorkforce';
import {IoMiningIndustries} from '../../src/cards/base/IoMiningIndustries';
import {TestPlayers} from '../TestPlayers';
import {ICard} from '../../src/cards/ICard';

describe('SelectCard', function() {
  it('Throws error when selected card was not enabled', function() {
    const player = TestPlayers.BLUE.newPlayer();
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

