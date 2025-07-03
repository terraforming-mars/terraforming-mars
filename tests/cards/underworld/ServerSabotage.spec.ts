import {expect} from 'chai';
import {IGame} from '../../../src/server/IGame';
import {ServerSabotage} from '../../../src/server/cards/underworld/ServerSabotage';
import {TestPlayer} from '../../TestPlayer';
import {testGame} from '../../TestGame';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

describe('ServerSabotage', () => {
  let card: ServerSabotage;
  let player: TestPlayer;
  let game: IGame;

  beforeEach(() => {
    card = new ServerSabotage();
    [game, player] = testGame(2, {underworldExpansion: true});
  });

  it('play', () => {
    const spaces = UnderworldExpansion.excavatableSpaces(player, {ignorePlacementRestrictions: true});
    for (const space of spaces) {
      space.undergroundResources = 'nothing';
    }
    game.underworldData.tokens = [];

    player.underworldData.corruption = 0;
    card.play(player);
    player.underworldData.corruption = 1;

    expect(player.cardsInHand).to.have.length(1);
    expect(game.underworldData.tokens).to.have.members([
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing', 'nothing',
      'nothing']);
    for (const space of spaces) {
      expect(space.undergroundResources, space.id).is.undefined;
    }
  });
});
