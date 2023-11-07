import {expect} from 'chai';
import {PriceWars} from '../../../src/server/cards/underworld/PriceWars';
import {testGame} from '../../TestGame';
import {cast, forceGenerationEnd, runAllActions} from '../../TestingUtils';


describe('PriceWars', () => {
  it('canPlay', () => {
    const card = new PriceWars();
    const [/* game */, player] = testGame(2, {underworldExpansion: true});

    player.underworldData.corruption = 1;
    expect(card.canPlay(player)).is.false;

    player.underworldData.corruption = 2;
    expect(card.canPlay(player)).is.true;
  });

  it('Should play', () => {
    const card = new PriceWars();
    const [game, player, player2] = testGame(2, {underworldExpansion: true});

    expect(game.generation).eq(1);

    forceGenerationEnd(game);
    expect(game.generation).eq(2);

    expect(player.getSteelValue()).eq(2);
    expect(player.getTitaniumValue()).eq(3);

    expect(player2.getSteelValue()).eq(2);
    expect(player2.getTitaniumValue()).eq(3);

    cast(card.play(player), undefined);
    runAllActions(game);
    player.playedCards.push(card);

    expect(player.getSteelValue()).eq(3);
    expect(player.getTitaniumValue()).eq(4);

    expect(player2.getSteelValue()).eq(1);
    expect(player2.getTitaniumValue()).eq(2);

    forceGenerationEnd(game);

    expect(game.generation).eq(3);

    expect(player.getSteelValue()).eq(2);
    expect(player.getTitaniumValue()).eq(3);

    expect(player2.getSteelValue()).eq(2);
    expect(player2.getTitaniumValue()).eq(3);

    forceGenerationEnd(game);
    expect(game.generation).eq(4);

    expect(player.getSteelValue()).eq(2);
    expect(player.getTitaniumValue()).eq(3);

    expect(player2.getSteelValue()).eq(2);
    expect(player2.getTitaniumValue()).eq(3);
  });
});
