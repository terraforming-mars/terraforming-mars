import {expect} from 'chai';
import {OumuamuaTypeObjectSurvey} from '../../../src/cards/pathfinders/OumuamuaTypeObjectSurvey';
import {Game} from '../../../src/Game';
import {TestPlayer} from '../../TestPlayer';
import {TestPlayers} from '../../TestPlayers';
import {LunarObservationPost} from '../../../src/cards/moon/LunarObservationPost';
import {TestingUtils} from '../../TestingUtils';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {CardName} from '../../../src/common/cards/CardName';
import {Tags} from '../../../src/common/cards/Tags';
import {CardRequirements} from '../../../src/cards/CardRequirements';
import {Dealer} from '../../../src/Dealer';
import {Resources} from '../../../src/common/Resources';

describe('OumuamuaTypeObjectSurvey', function() {
  let card: OumuamuaTypeObjectSurvey;
  let player: TestPlayer;
  let game: Game;
  let dealer: Dealer;

  const noTags = TestingUtils.fakeCard({
    name: 'none' as CardName,
    tags: [],
  });
  const earthTag = TestingUtils.fakeCard({
    name: 'earth' as CardName,
    tags: [Tags.EARTH],
  });
  const scienceTag: IProjectCard = TestingUtils.fakeCard({
    name: 'sci' as CardName,
    tags: [Tags.SCIENCE],
  });
  const microbeTag: IProjectCard = TestingUtils.fakeCard({
    name: 'mi' as CardName,
    tags: [Tags.MICROBE],
  });
  const spaceTag = TestingUtils.fakeCard({
    name: 'space' as CardName,
    tags: [Tags.SPACE],
  });
  const scienceMicrobeTag = TestingUtils.fakeCard({
    name: 'sci/mi' as CardName,
    tags: [Tags.SCIENCE, Tags.MICROBE],
  });
  const spaceScienceTag = TestingUtils.fakeCard({
    cost: 20,
    name: 'space/sci' as CardName,
    tags: [Tags.SPACE, Tags.SCIENCE],
  });
  const requirementsCard = TestingUtils.fakeCard({
    cost: 10,
    name: 'req' as CardName,
    tags: [Tags.SCIENCE],
    requirements: CardRequirements.builder((b) => b.temperature(-28, {max: true})),
  });
  // The slug is the card at the bottom of the deck. If it were drawn, the deck would be empty and refilled from the discard pile.
  const slug = TestingUtils.fakeCard({
    name: 'slug' as CardName,
    tags: [],
  });

  beforeEach(function() {
    card = new OumuamuaTypeObjectSurvey();
    player = TestPlayers.BLUE.newPlayer();
    game = Game.newInstance('foobar', [player], player);
    dealer = game.dealer;
    dealer.discarded = [];
    player.megaCredits = 100;
  });

  it('Neither drawn card valid', () => {
    dealer.deck = [slug, earthTag, noTags];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags, earthTag]);
    expect(player.playedCards).is.empty;
    expect(player.getProduction(Resources.ENERGY)).eq(0);
  });

  it('Card has a space tag', () => {
    dealer.deck = [slug, spaceTag, noTags];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags, spaceTag]);
    expect(player.playedCards).is.empty;
    expect(player.getProduction(Resources.ENERGY)).eq(3);
  });

  it('Two cards with space tags, only the first one is used', () => {
    // spaceTag will be drawn first, so spaceScienceTag won't be evaluated.
    dealer.deck = [slug, spaceScienceTag, spaceTag];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([spaceTag, spaceScienceTag]);
    expect(player.playedCards).is.empty;
    expect(player.getProduction(Resources.ENERGY)).eq(3);
  });

  it('Two cards with space tags, but first one has science tag', () => {
    // spaceScienceTag will be drawn first, so spaceTag won't be evaluated.
    dealer.deck = [slug, spaceTag, spaceScienceTag];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([spaceTag]);
    expect(player.playedCards).deep.eq([spaceScienceTag]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a microbe tag', () => {
    dealer.deck = [slug, microbeTag, noTags];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([microbeTag]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a science tag', () => {
    dealer.deck = [slug, scienceTag, noTags];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([scienceTag]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a science tag and microbe tag', () => {
    dealer.deck = [slug, scienceMicrobeTag, noTags];

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([scienceMicrobeTag]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has requirements', () => {
    dealer.deck = [slug, requirementsCard, noTags];

    expect(player.canPlay(requirementsCard)).is.true;
    (game as any).temperature = 0;
    expect(player.canPlay(requirementsCard)).is.false;

    card.play(player);

    expect(dealer.deck).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([requirementsCard]);
    expect(player.getProduction(Resources.ENERGY)).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('The part where a card gets 2 data', function() {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];
    // Put two cards on the front of the deck so they don't have data
    dealer.deck.push(slug, noTags);

    card.play(player);
    TestingUtils.runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(2);
  });
});
