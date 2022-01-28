import {expect} from 'chai';
import {PublicSponsoredGrant} from '../../../src/cards/pathfinders/PublicSponsoredGrant';
import {Game} from '../../../src/Game';
import {Turmoil} from '../../../src/turmoil/Turmoil';
import {TestPlayer} from '../../TestPlayer';
import {getTestPlayer, newTestGame} from '../../TestGame';
import {BiomassCombustors} from '../../../src/cards/base/BiomassCombustors';
import {SearchForLife} from '../../../src/cards/base/SearchForLife';
import {ColonizerTrainingCamp} from '../../../src/cards/base/ColonizerTrainingCamp';
import {Unity} from '../../../src/turmoil/parties/Unity';
import {Scientists} from '../../../src/turmoil/parties/Scientists';
import {Tags} from '../../../src/cards/Tags';
import {CardName} from '../../../src/CardName';

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

  it('play', function() {
    player.megaCredits = 4;
    player2.megaCredits = 1;
    player3.megaCredits = 0;

    const options = card.play(player);

    expect(player.megaCredits).eq(2);
    expect(player2.megaCredits).eq(0);
    expect(player3.megaCredits).eq(0);

    expect(options.options[0].title).eq(Tags.BUILDING);
    expect(player.cardsInHand).is.empty;

    const scienceCard = new SearchForLife();
    const buildingCard1 = new BiomassCombustors();
    const buildingCard2 = new ColonizerTrainingCamp();
    game.dealer.deck.push(buildingCard1, scienceCard, buildingCard2);
    game.dealer.discarded = [];

    options.options[0].cb();

    expect(player.cardsInHand.map((c) => c.name)).has.members([CardName.BIOMASS_COMBUSTORS, CardName.COLONIZER_TRAINING_CAMP]);
    expect(game.dealer.discarded.map((c) => c.name)).deep.eq([CardName.SEARCH_FOR_LIFE]);
  });
});
