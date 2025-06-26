import {expect} from 'chai';
import {PublicSponsoredGrant} from '../../../src/server/cards/pathfinders/PublicSponsoredGrant';
import {IGame} from '../../../src/server/IGame';
import {Turmoil} from '../../../src/server/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {BiomassCombustors} from '../../../src/server/cards/base/BiomassCombustors';
import {SearchForLife} from '../../../src/server/cards/base/SearchForLife';
import {ColonizerTrainingCamp} from '../../../src/server/cards/base/ColonizerTrainingCamp';
import {Unity} from '../../../src/server/turmoil/parties/Unity';
import {Scientists} from '../../../src/server/turmoil/parties/Scientists';
import {Tag} from '../../../src/common/cards/Tag';
import {CardName} from '../../../src/common/cards/CardName';
import {MonsInsurance} from '../../../src/server/cards/promo/MonsInsurance';
import {OrOptions} from '../../../src/server/inputs/OrOptions';
import {cast} from '../../TestingUtils';
import {toName} from '../../../src/common/utils/utils';
import {CardType} from '../../../src/common/cards/CardType';

describe('PublicSponsoredGrant', () => {
  let card: PublicSponsoredGrant;
  let player: TestPlayer;
  let player2: TestPlayer;
  let player3: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new PublicSponsoredGrant();
    [game, player, player2, player3] = testGame(3, {turmoilExtension: true});
  });

  it('canPlay', () => {
    player.megaCredits = card.cost;
    const turmoil = Turmoil.getTurmoil(player.game);
    turmoil.rulingParty = new Unity();
    expect(player.canPlay(card)).is.false;
    turmoil.rulingParty = new Scientists();
    expect(player.canPlay(card)).is.true;
  });

  it('play', () => {
    player.megaCredits = 4;
    player2.megaCredits = 1;
    player3.megaCredits = 0;

    const options = cast(card.play(player), OrOptions);

    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(0);

    // Confirming that tags are filtered appropriately.
    expect(options.options.map((o) => o.title)).to.contain(Tag.SPACE);
    expect(options.options.map((o) => o.title)).to.not.contain(Tag.JOVIAN);

    expect(options.options[0].title).eq(Tag.BUILDING);

    expect(player.cardsInHand).is.empty;

    const scienceCard = new SearchForLife();
    const buildingCard1 = new BiomassCombustors();
    const buildingCard2 = new ColonizerTrainingCamp();
    game.projectDeck.drawPile.push(buildingCard1, scienceCard, buildingCard2);
    game.projectDeck.discardPile = [];

    options.options[0].cb();

    expect(player.cardsInHand.map(toName)).has.members([CardName.BIOMASS_COMBUSTORS, CardName.COLONIZER_TRAINING_CAMP]);
    expect(game.projectDeck.discardPile.map(toName)).deep.eq([CardName.SEARCH_FOR_LIFE]);
  });

  it('works with events', () => {
    const options = cast(card.play(player), OrOptions);
    const eventOption = options.options.find((o) => o.title === Tag.EVENT)!;

    expect(player.cardsInHand).is.empty;

    eventOption.cb();

    expect(player.cardsInHand.map((c) => c.type)).deep.eq([CardType.EVENT, CardType.EVENT]);
  });

  it('compatible with Mons Insurance', () => {
    player2.corporations.push(new MonsInsurance());
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
