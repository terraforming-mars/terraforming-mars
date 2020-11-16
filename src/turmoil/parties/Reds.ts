import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {ISpace} from '../../ISpace';
import {Player} from '../../Player';
import {CardName} from '../../CardName';

export class Reds extends Party implements IParty {
  name = PartyName.REDS;
  description = 'Wishes to preserve the red planet.';
  bonuses = [new RedsBonus01(), new RedsBonus02()];
}

export class RedsBonus01 implements Bonus {
  id = 'rb01';
  description = 'The player with the lowest TR gains 1 TR (ties are friendly)';
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
  description = 'The player with the highest TR loses 1 TR (ties are friendly)';

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

export class RedsPolicy01 implements Policy {
  id = 'rp01';
  isDefault = true;
  description: string = 'Whenever you take an action that raises TR, you MUST pay 3 MC per step raised';
}

export class RedsPolicy02 implements Policy {
  id = 'rp02';
  description: string = 'After you place a tile, pay 3 MC or as much as possible';

  onTilePlaced(player: Player, _space: ISpace, game: Game) {
    let amountPlayerHas: number = player.megaCredits;
    if (player.isCorporation(CardName.HELION)) amountPlayerHas += player.heat;

    const amountToPay = Math.min(amountPlayerHas, 3);
    if (amountToPay > 0) {
      game.defer(new SelectHowToPayDeferred(player, amountToPay, false, false, 'Select how to pay for tile placement'));
    }
  }
}

export class RedsPolicy03 implements Policy {
  id = 'rp03';
  description: string = 'Whenever you use a Standard Project (except selling patents), discard a card if possible';
}

export class RedsPolicy04 implements Policy {
  id = 'rp04';
  description: string = 'Whenever you raise a global parameter, decrease your MC production 1 step per step raised if possible';
}
