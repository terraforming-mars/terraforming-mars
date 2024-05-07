import {expect} from 'chai';
import {GeologistTeam} from '../../../src/server/cards/underworld/GeologistTeam';
import {testGame} from '../../TestGame';
import {runAllActions} from '../../TestingUtils';
import {assertIsIdentificationAction} from '../../underworld/underworldAssertions';
import {UnderworldExpansion} from '../../../src/server/underworld/UnderworldExpansion';

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
    expect(player.getTerraformRating()).eq(20);

    game.underworldData.tokens.push('ocean');
    UnderworldExpansion.identify(game, spaces[1], player);
    expect(player.getTerraformRating()).eq(21);

    game.underworldData.tokens.push('ocean');
    UnderworldExpansion.identify(game, spaces[2], player2);
    expect(player.getTerraformRating()).eq(22);
  });
});
