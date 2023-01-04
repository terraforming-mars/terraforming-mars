import {expect} from 'chai';
import {PublicSponsoredGrant} from '../../../src/server/cards/pathfinders/PublicSponsoredGrant';
import {Game} from '../../../src/server/Game';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Scientists} from '../../../src/server/turmoil/parties/Scientists';
import {Tag} from '../../../src/common/cards/Tag';
import {CardName} from '../../../src/common/cards/CardName';
import {MonsInsurance} from '../../../src/server/cards/promo/MonsInsurance';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';

describe('PublicSponsoredGrant', function() {
  let card: PublicSponsoredGrant;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: Game;

  beforeEach(function() {
    card = new PublicSponsoredGrant();
    game = newTestGame(3, {turmoilExtension: true});
    player = getTestPlayer(game, 0);
    player2 = getTestPlayer(game, 1);
    player3 = getTestPlayer(game, 2);
  });

  it('canPlay', function() {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Scientists();
    expect(player.canPlay(card)).is.true;
  });

  it('Credit deductions work as expected', function() {
    player.megaCredits = 4;
    player2.megaCredits = 1;
    player3.megaCredits = 0;

    cast(card.play(player), OrOptions);

    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(0);
  });

  it('There are only 8 Tag-options to choose from.', function() {
    const options = cast(card.play(player), OrOptions);
    expect(options.options.length).eq(8);
  });

  it('Find Specially Crafted BUILDING Tags', function() {
    const options = cast(card.play(player), OrOptions);
    expect(options.options[0].title).eq(Tag.BUILDING);

    const scienceCard = new SearchForLife();
    const buildingCard1 = new BiomassCombustors();
    const buildingCard2 = new ColonizerTrainingCamp();
    game.projectDeck.drawPile.push(buildingCard1, scienceCard, buildingCard2);
    game.projectDeck.discardPile = [];

    expect(player.cardsInHand).is.empty;
    options.options[0].cb();
    expect(player.cardsInHand.length).eq(2)
    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.BIOMASS_COMBUSTORS, CardName.COLONIZER_TRAINING_CAMP]);
    expect(game.projectDeck.discardPile.map((c) => c.name)).deep.eq([CardName.SEARCH_FOR_LIFE]);
  });

  //
  // Individual tests for every TAG
  //
  const TAGS = [
    Tag.BUILDING,
    Tag.SPACE,
    Tag.SCIENCE,
    Tag.POWER,
    Tag.PLANT,
    Tag.MICROBE,
    Tag.ANIMAL,
    Tag.EVENT,
  ]
  for(let i=0; i<=TAGS.length -1; i++){
    it('Option "['+ i +']" is "' + TAGS[i] + '" Tag', function() {
      const options = cast(card.play(player), OrOptions);
      expect(options.options[7].title).eq(Tag.EVENT);
    });
    it('Find Generic "' + TAGS[i] + '" Tags', function() {
      const options = cast(card.play(player), OrOptions);
      expect(options.options[i].title).eq(TAGS[i]);
      expect(player.cardsInHand).is.empty;
      options.options[i].cb();
      expect(player.cardsInHand.length).eq(2)
    });
  }

  it('compatible with Mons Insurance', function() {
    player2.setCorporationForTest(new MonsInsurance());
    // This isn't very clean but it's necessary for the test.
    game.monsInsuranceOwner = player2.id;
    player.megaCredits = 10;
    player2.megaCredits = 10;
    player3.megaCredits = 10;

    card.play(player);

    // This is a great test, because player1 instigated the loss, so does not get an insurance
    // payout. Player 2 loses the payout and player 3 gets it.
    expect(player.megaCredits).eq(8);
    expect(player2.megaCredits).eq(5);
    expect(player3.megaCredits).eq(11);
  });
});
