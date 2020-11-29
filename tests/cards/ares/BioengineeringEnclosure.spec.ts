import {BioengineeringEnclosure} from '../../../src/cards/ares/BioengineeringEnclosure';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {IProjectCard} from '../../../src/cards/IProjectCard';
import {CardName} from '../../../src/CardName';
import {Tags} from '../../../src/cards/Tags';
import {CardType} from '../../../src/cards/CardType';
import {ResourceType} from '../../../src/ResourceType';
import {expect} from 'chai';
import {ARES_OPTIONS_NO_HAZARDS} from '../../ares/AresTestHelper';
import {TestPlayers} from '../../TestingUtils';

describe('BioengineeringEnclosure', function() {
  let card : BioengineeringEnclosure; let blue : Player; let game : Game;

  const scienceTagCard: IProjectCard = {
    name: CardName.ACQUIRED_COMPANY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [Tags.SCIENCE],
    play: () => undefined,
  };

  const animalHost: IProjectCard = {
    name: CardName.ACQUIRED_SPACE_AGENCY,
    cardType: CardType.ACTIVE,
    cost: 0,
    tags: [],
    resourceType: ResourceType.ANIMAL,
    resourceCount: 0,
    play: () => undefined,
  };

  beforeEach(function() {
    card = new BioengineeringEnclosure();
    blue = TestPlayers.BLUE.newPlayer();
    game = new Game('foobar', [blue, blue], blue, ARES_OPTIONS_NO_HAZARDS);
  });

  it('Can\'t play without a science tag', () => {
    expect(card.canPlay(blue, game)).is.false;
    blue.playCard(game, scienceTagCard);
    expect(card.canPlay(blue, game)).is.true;
  });

  it('Play', () => {
    expect(card.resourceCount).eq(0);
    card.play(blue, game);
    expect(card.resourceCount).eq(2);
  });

  it('Can\'t move animal if it\'s empty', () => {
    card.play(blue, game);
    blue.playCard(game, animalHost);
    card.resourceCount = 0;
    expect(card.canAct(blue)).is.false;
  });

  it('Can\'t move animal if theres not another card', () => {
    card.play(blue, game);
    expect(card.canAct(blue)).is.false;
  });

  it('Move animal', () => {
    // Set up the cards.
    blue.playCard(game, animalHost);
    blue.playCard(game, card);

    // Initial expectations that will change after playing the card.
    expect(card.canAct(blue)).is.true;
    expect(card.resourceCount).eq(2);
    expect(animalHost.resourceCount).eq(0);
    expect(game.deferredActions).has.lengthOf(0);

    card.action(blue, game);

    game.deferredActions.next()!.execute();

    expect(card.resourceCount).eq(1);
    expect(animalHost.resourceCount).eq(1);
  });
});
