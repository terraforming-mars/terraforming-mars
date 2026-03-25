import {expect} from 'chai';
import {Tactician} from '../../src/server/milestones/Tactician';
import {CupolaCity} from '../../src/server/cards/base/CupolaCity';
import {VenusianAnimals} from '../../src/server/cards/venusNext/VenusianAnimals';
import {SpaceHotels} from '../../src/server/cards/prelude/SpaceHotels';
import {GMOContract} from '../../src/server/cards/turmoil/GMOContract';
import {PioneerSettlement} from '../../src/server/cards/colonies/PioneerSettlement';
import {Algae} from '../../src/server/cards/base/Algae';
import {TestPlayer} from '../TestPlayer';
import {fakeCard} from '../TestingUtils';
import {CardType} from '../../src/common/cards/CardType';

describe('Tactician', () => {
  let milestone: Tactician;
  let player: TestPlayer;

  beforeEach(() => {
    milestone = new Tactician();
    player = TestPlayer.BLUE.newPlayer();
  });

  it('Can not claim without 5 cards with requirements', () => {
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard());
    player.playedCards.push(fakeCard());
    player.playedCards.push(fakeCard());
    player.playedCards.push(fakeCard());

    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Excludes event cards with requirements', () => {
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({type: CardType.EVENT, requirements: [{cities: 1}]}));

    expect(milestone.canClaim(player)).is.not.true;
  });

  it('Can claim with 5 cards with requirements', () => {
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));
    player.playedCards.push(fakeCard({requirements: [{cities: 1}]}));

    expect(milestone.canClaim(player)).is.true;
  });


  it('Can claim with >5 cards (here: 6) with requirements', () => {
    player.playedCards.push(new CupolaCity());
    player.playedCards.push(new VenusianAnimals());
    player.playedCards.push(new SpaceHotels());
    player.playedCards.push(new PioneerSettlement());
    player.playedCards.push(new GMOContract());
    player.playedCards.push(new Algae());

    expect(milestone.canClaim(player)).is.true;
  });
});
