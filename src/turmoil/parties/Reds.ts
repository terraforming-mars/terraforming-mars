import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';

export class Reds extends Party implements IParty {
  name = PartyName.REDS;
  description = 'Wishes to preserve the red planet.';
  bonuses = [new RedsBonus01(), new RedsBonus02()];
}

export class RedsBonus01 implements Bonus {
  id = 'rb01';
  description = 'The player with the lowest TR gains 1 TR. Ties are friendly.';
  isDefault = true;

  grant(game: Game) {
    const players = game.getPlayers();

    if (game.isSoloMode() && players[0].getTerraformRating() <= 20) {
      players[0].increaseTerraformRating(game);
    } else {
      players.sort((p1, p2) => p1.getTerraformRating() - p2.getTerraformRating());
      const min = players[0].getTerraformRating();

      while (players.length > 0 && players[0].getTerraformRating() === min) {
        players[0].increaseTerraformRating(game);
        players.shift();
      }
    }
  }
}

export class RedsBonus02 implements Bonus {
  id = 'rb02';
  description = 'The player with the highest TR loses 1 TR. Ties are friendly.';

  grant(game: Game) {
    const players = game.getPlayers();

    if (game.isSoloMode() && players[0].getTerraformRating() > 20) {
      players[0].decreaseTerraformRating();
    } else {
      players.sort((p1, p2) => p2.getTerraformRating() - p1.getTerraformRating());
      const max = players[0].getTerraformRating();
      
      while (players.length > 0 && players[0].getTerraformRating() === max) {
        players[0].decreaseTerraformRating();
        players.shift();
      }
    }
  }
}