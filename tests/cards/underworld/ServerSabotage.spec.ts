import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {ServerSabotage} from '../../../src/server/cards/underworld/ServerSabotage';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {Cryptocurrency} from '../../../src/server/cards/pathfinders/Cryptocurrency';
import {CommunicationCenter} from '../../../src/server/cards/pathfinders/CommunicationCenter';
import {cast, runAllActions} from '../../TestingUtils';
import {SelectCard} from '../../../src/server/inputs/SelectCard';

describe('ServerSabotage', () => {
  let card: ServerSabotage;
  let player: TestPlayer;
  let player2: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ServerSabotage();
    [game, player, player2] = testGame(2, {underworldExpansion: true});
  });

  it('play', () => {
    const spaces = UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true});
    for (const space of spaces) {
      space.undergroundResources = 'card1';
    }
    game.underworldData.tokens = [];

    const claimedSpaces = spaces.slice(0, 10);
    for (const space of claimedSpaces) {
      space.excavator = player;
    }

    player.underworldData.corruption = 0;
    card.play(player);
    player.underworldData.corruption = 1;
    expect(game.underworldData.tokens).to.have.members([
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1', 'card1',
      'card1']);
    for (const space of spaces) {
      if (claimedSpaces.includes(space)) {
        expect(space.excavator, space.id).eq(player);
        expect(space.undergroundResources, space.id).eq('card1');
      } else {
        expect(space.excavator, space.id).is.undefined;
        expect(space.undergroundResources, space.id).is.undefined;
      }
    }
  });

  it('remove data, two players with data', () => {
    const cryptocurrency = new Cryptocurrency();
    const communicationCenter = new CommunicationCenter();

    player.playedCards.push(cryptocurrency);
    player2.playedCards.push(communicationCenter);

    cryptocurrency.resourceCount = 2;
    communicationCenter.resourceCount = 6;

    card.play(player);

    runAllActions(player.game);

    const selectCard = cast(player.popWaitingFor(), SelectCard);
    expect(selectCard.cards).has.members([cryptocurrency, communicationCenter]);
    selectCard.cb([communicationCenter]);
    expect(communicationCenter.resourceCount).eq(4);
  });
});
