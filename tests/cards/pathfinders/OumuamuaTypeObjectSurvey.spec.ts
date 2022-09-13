import {expect} from 'chai';
import {OumuamuaTypeObjectSurvey} from '../../../src/server/cards/pathfinders/OumuamuaTypeObjectSurvey';
import {Game} from '../../../src/server/Game';
import {TestPlayer} from '../../TestPlayer';
import {LunarObservationPost} from '../../../src/server/cards/moon/LunarObservationPost';
import {fakeCard, runAllActions} from '../../TestingUtils';
import {IProjectCard} from '../../../src/server/cards/IProjectCard';
import {CardName} from '../../../src/common/cards/CardName';
import {Tag} from '../../../src/common/cards/Tag';
import {CardRequirements} from '../../../src/server/cards/CardRequirements';
import {ProjectDeck} from '../../../src/server/cards/Deck';

describe('OumuamuaTypeObjectSurvey', function() {
  let card: OumuamuaTypeObjectSurvey;
  let player: TestPlayer;
  let game: Game;
  let projectDeck: ProjectDeck;

  const noTags = fakeCard({
    name: 'none' as CardName,
    tags: [],
  });
  const earthTag = fakeCard({
    name: 'earth' as CardName,
    tags: [Tag.EARTH],
  });
  const scienceTag: IProjectCard = fakeCard({
    name: 'sci' as CardName,
    tags: [Tag.SCIENCE],
  });
  const microbeTag: IProjectCard = fakeCard({
    name: 'mi' as CardName,
    tags: [Tag.MICROBE],
  });
  const spaceTag = fakeCard({
    name: 'space' as CardName,
    tags: [Tag.SPACE],
  });
  const scienceMicrobeTag = fakeCard({
    name: 'sci/mi' as CardName,
    tags: [Tag.SCIENCE, Tag.MICROBE],
  });
  const spaceScienceTag = fakeCard({
    cost: 20,
    name: 'space/sci' as CardName,
    tags: [Tag.SPACE, Tag.SCIENCE],
  });
  const requirementsCard = fakeCard({
    cost: 10,
    name: 'req' as CardName,
    tags: [Tag.SCIENCE],
    requirements: CardRequirements.builder((b) => b.temperature(-28, {max: true})),
  });
  // The slug is the card at the bottom of the deck. If it were drawn, the deck would be empty and refilled from the discard pile.
  const slug = fakeCard({
    name: 'slug' as CardName,
    tags: [],
  });

  beforeEach(function() {
    card = new OumuamuaTypeObjectSurvey();
    player = TestPlayer.BLUE.newPlayer();
    game = Game.newInstance('gameid', [player], player);
    projectDeck = game.projectDeck;
    projectDeck.discardPile = [];
    player.megaCredits = 100;
  });

  it('Neither drawn card valid', () => {
    projectDeck.drawPile = [slug, earthTag, noTags];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags, earthTag]);
    expect(player.playedCards).is.empty;
    expect(player.production.energy).eq(0);
  });

  it('Card has a space tag', () => {
    projectDeck.drawPile = [slug, spaceTag, noTags];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags, spaceTag]);
    expect(player.playedCards).is.empty;
    expect(player.production.energy).eq(3);
  });

  it('Two cards with space tags, only the first one is used', () => {
    // spaceTag will be drawn first, so spaceScienceTag won't be evaluated.
    projectDeck.drawPile = [slug, spaceScienceTag, spaceTag];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([spaceTag, spaceScienceTag]);
    expect(player.playedCards).is.empty;
    expect(player.production.energy).eq(3);
  });

  it('Two cards with space tags, but first one has science tag', () => {
    // spaceScienceTag will be drawn first, so spaceTag won't be evaluated.
    projectDeck.drawPile = [slug, spaceTag, spaceScienceTag];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([spaceTag]);
    expect(player.playedCards).deep.eq([spaceScienceTag]);
    expect(player.production.energy).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a microbe tag', () => {
    projectDeck.drawPile = [slug, microbeTag, noTags];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([microbeTag]);
    expect(player.production.energy).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a science tag', () => {
    projectDeck.drawPile = [slug, scienceTag, noTags];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([scienceTag]);
    expect(player.production.energy).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has a science tag and microbe tag', () => {
    projectDeck.drawPile = [slug, scienceMicrobeTag, noTags];

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([scienceMicrobeTag]);
    expect(player.production.energy).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('Card has requirements', () => {
    projectDeck.drawPile = [slug, requirementsCard, noTags];

    expect(player.canPlay(requirementsCard)).is.true;
    (game as any).temperature = 0;
    expect(player.canPlay(requirementsCard)).is.false;

    card.play(player);

    expect(projectDeck.drawPile).deep.eq([slug]);
    expect(player.cardsInHand).deep.eq([noTags]);
    expect(player.playedCards).deep.eq([requirementsCard]);
    expect(player.production.energy).eq(0);
    // played card doesn't cost anything.
    expect(player.megaCredits).eq(100);
  });

  it('The part where a card gets 2 data', function() {
    const lunarObservationPost = new LunarObservationPost();
    player.playedCards = [lunarObservationPost];
    // Put two cards on the front of the deck so they don't have data
    projectDeck.drawPile.push(slug, noTags);

    card.play(player);
    runAllActions(game);

    expect(lunarObservationPost.resourceCount).eq(2);
  });
});
