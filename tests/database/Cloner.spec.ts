import {expect} from 'chai';
import {Cloner} from '../../src/server/database/Cloner';
import {Game} from '../../src/server/Game';
import {Player} from '../../src/server/Player';
import {setCustomGameOptions} from '../TestingUtils';
import {Color} from '../../src/common/Color';

describe('Cloner', function() {
  it('solo game preserved', () => {
    const player = new Player('old-player1', Color.YELLOW, true, 9, 'p-old-player1-id');
    const game = Game.newInstance(
      'g-old-game-id', [player], player, setCustomGameOptions({}), -5179823149812374);

    const newPlayer = new Player('new-player1', Color.RED, false, 3, 'p-new-player1-id');
    const newGame = Cloner.clone('g-new-id', [newPlayer], 0, game.serialize());

    expect(newGame.id).eq('g-new-id');
    expect(game.getPlayerById('p-old-player1-id')).is.not.undefined;
    expect(() => game.getPlayerById('p-new-player1-id')).to.throw();
    expect(() => newGame.getPlayerById('p-old-player1-id')).to.throw();
    expect(newGame.getPlayerById('p-new-player1-id')).is.not.undefined;

    const newPlayerZero = newGame.getPlayersInGenerationOrder()[0];
    expect(newPlayerZero.color).eq(Color.RED);
    expect(newPlayerZero.beginner).is.true;

    expect(player.getTerraformRating()).eq(23);
    expect(player.terraformRatingAtGenerationStart).eq(14);
    expect(player.handicap).eq(9);

    expect(newPlayerZero.getTerraformRating()).eq(17);
    expect(player.terraformRatingAtGenerationStart).eq(14);
    expect(newPlayerZero.handicap).eq(3);

    expect(player.dealtCorporationCards, 'dealtCorporationCards').deep.eq(newPlayerZero.dealtCorporationCards);
    expect(player.dealtProjectCards, 'dealtProjectCards').deep.eq(newPlayerZero.dealtProjectCards);
    expect(player.dealtPreludeCards, 'dealtPreludeCards').deep.eq(newPlayerZero.dealtPreludeCards);
    expect(player.cardsInHand, 'cardsInHand').deep.eq(newPlayerZero.cardsInHand);
    expect(player.preludeCardsInHand, 'preludeCardsInHand').deep.eq(newPlayerZero.preludeCardsInHand);
    expect(player.playedCards, 'playedCards').deep.eq(newPlayerZero.playedCards);
    expect(player.draftedCards, 'draftedCards').deep.eq(newPlayerZero.draftedCards);

    expect(game.rng.seed).eq(newGame.rng.seed);
    expect(game.gameAge).eq(newGame.gameAge);
    expect(game.undoCount).eq(newGame.undoCount);
    expect(game.projectDeck, 'projectDeck').to.deep.eq(newGame.projectDeck);
    expect(game.corporationDeck, 'corporationDeck').to.deep.eq(newGame.corporationDeck);
    expect(game.preludeDeck, 'preludeDeck').to.deep.eq(newGame.preludeDeck);
    expect(game.milestones, 'milestones').to.deep.eq(newGame.milestones);
    expect(game.awards, 'awards').to.deep.eq(newGame.awards);


    // validating two boards across two games as equal is a little tricky because player IDs have changed, so
    // doing a test in this manner instead.
    for (let idx = 0; idx < game.board.spaces.length; idx++) {
      const oldSpace = game.board.spaces[idx];
      const newSpace = newGame.board.spaces[idx];
      if (oldSpace.player !== undefined) {
        expect(oldSpace.player.color, `for idx ${idx}`).eq(Color.NEUTRAL);
        expect(newSpace.player!.color, `for idx ${idx}`).eq(Color.NEUTRAL);
        // By destroying these spaces (at the end of the test) the spaces can be tested for equality
        // ignoring `space.player`
        oldSpace.player = undefined;
        newSpace.player = undefined;
      } else {
        expect(newSpace.player, `for idx ${idx}`).is.undefined;
      }
    }
    // This test will pass now that space players have been separately verified.
    expect(game.board).to.deep.eq(newGame.board);
  });
});
