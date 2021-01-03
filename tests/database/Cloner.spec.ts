import {expect} from 'chai';
import {Cloner} from '../../src/database/Cloner';
import {Game} from '../../src/Game';
import {Player} from '../../src/Player';
import {setCustomGameOptions} from '../TestingUtils';
import {Color} from '../../src/Color';

describe('Cloner', function() {
  it('solo game preserved', () => {
    const player = new Player('old-player1', Color.YELLOW, true, 9, 'old-player1-id');
    const game = Game.newInstance('old-game-id', [player], player, setCustomGameOptions({}));

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
  });
});
