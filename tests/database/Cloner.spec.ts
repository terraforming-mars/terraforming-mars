import {expect} from 'chai';
import {Cloner} from '../../src/database/Cloner';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {TestingUtils} from '../TestingUtils';
import {Color} from '../../src/Color';

describe('Cloner', function() {
  it('solo game preserved', () => {
    const player = new Player('old-player1', Color.YELLOW, true, 9, 'old-player1-id');
    const game = Game.newInstance(
      'old-game-id', [player], player, TestingUtils.setCustomGameOptions({}), -5179823149812374);

    const newPlayer = new Player('new-player1', Color.RED, false, 3, 'new-player1-id');
    let newGame: Game | undefined = undefined;
    Cloner.clone('new-id', [newPlayer], 0, undefined, game.serialize(), (err, deserialized) => {
      expect(err).is.undefined;
      expect(deserialized).is.not.undefined;
      newGame = deserialized;
    });

    expect(newGame!.id).eq('new-id');
    expect(game.getPlayerById('old-player1-id')).is.not.undefined;
    expect(() => game.getPlayerById('new-player1-id')).to.throw();
    expect(() => newGame!.getPlayerById('old-player1-id')).to.throw();
    expect(newGame!.getPlayerById('new-player1-id')).is.not.undefined;

    const newPlayerZero = newGame!.getPlayers()[0];
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

    expect(game.seed).eq(newGame!.seed);
    expect(game.gameAge).eq(newGame!.gameAge);
    expect(game.undoCount).eq(newGame!.undoCount);
    expect(game.dealer, 'dealer').to.deep.eq(newGame!.dealer);
    expect(game.milestones, 'milestones').to.deep.eq(newGame!.milestones);
    expect(game.awards, 'awards').to.deep.eq(newGame!.awards);


    // validating two boards across two games as equal is a little tricky because player IDs have changed, so
    // doing a test in this manner instead.
    for (let idx = 0; idx < game.board.spaces.length; idx++) {
      const oldSpace = game.board.spaces[idx];
      const newSpace = newGame!.board.spaces[idx];
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
    expect(game.board).to.deep.eq(newGame!.board);
  });
});
