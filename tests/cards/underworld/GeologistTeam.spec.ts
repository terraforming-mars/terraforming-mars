import {expect} from 'chai';
import {GeologistTeam} from '../../../src/server/cards/underworld/GeologistTeam';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';
import {cast} from '../../../src/common/utils/utils';

describe('GeologistTeam', () => {
  it('action', () => {
    const card = new GeologistTeam();
    const [game, player] = testGame(2, {underworldExpansion: true});

    card.action(player);
    runAllActions(game);
    assertIsIdentificationAction(player, player.popWaitingFor());
  });

  it('Should play', () => {
    const card = new GeologistTeam();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});

    player.playedCards.push(card);

    player.setTerraformRating(20);
    game.underworldData.tokens.push('corruption1');
    const spaces = UnderworldExpansion.identifiableSpaces(player);
    UnderworldExpansion.identify(game, spaces[0], player);
    expect(player.terraformRating).eq(20);

    game.underworldData.tokens.push('ocean');
    UnderworldExpansion.identify(game, spaces[1], player);
    expect(player.terraformRating).eq(21);

    game.underworldData.tokens.push('ocean');
    UnderworldExpansion.identify(game, spaces[2], player2);
    expect(player.terraformRating).eq(22);
  });

  it('Should gain TR when drawing ocean from pool (Mars fully identified)', () => {
    const card = new GeologistTeam();
    const [game, player] = testGame(2, {underworldExpansion: true});
    player.playedCards.push(card);
    player.setTerraformRating(20);

    // Fill all identifiable spaces so none remain for selection
    for (const space of UnderworldExpansion.identifiableSpaces(player)) {
      space.undergroundResources = 'nothing';
    }

    // Put an ocean token in the pool for the action to draw
    game.underworldData.tokens.push('ocean');

    card.action(player);
    runAllActions(game);
    cast(player.popWaitingFor(), undefined);

    expect(player.terraformRating).eq(21);
  });
});
