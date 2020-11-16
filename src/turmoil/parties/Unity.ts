import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from './PartyName';
import {Game} from '../../Game';
import {Tags} from '../../cards/Tags';
import {Resources} from '../../Resources';
import {Bonus} from '../Bonus';
import {Policy} from '../Policy';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {Player} from '../../Player';
import {BuildColony} from '../../deferredActions/BuildColony';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  description: string = 'Wants to see humanity prosper in the whole solar system.';
  bonuses = [new UnityBonus01(), new UnityBonus02()];
}

export class UnityBonus01 implements Bonus {
  id = 'ub01';
  description = 'Gain 1 MC for each Venus, Earth and Jovian tag you have';
  isDefault = true;

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tags = [Tags.VENUS, Tags.EARTH, Tags.JOVIAN];
      const tagCount = tags.map((tag) => player.getTagCount(tag, false, false)).reduce((acc, count) => acc + count, 0);

      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class UnityBonus02 implements Bonus {
  id = 'ub02';
  description = 'Gain 1 MC for each Space tag you have, including events';

  grant(game: Game) {
    game.getPlayers().forEach((player) => {
      const tagCount = player.getTagCount(Tags.SPACE, true, false);
      player.setResource(Resources.MEGACREDITS, tagCount);
    });
  }
}

export class UnityPolicy01 implements Policy {
  isDefault = true;
  id = 'up01';
  description: string = 'Your titanium resources are worth 1 MC extra';
}

export class UnityPolicy02 implements Policy {
  id = 'up02';
  description: string = 'Spend 15 MC (titanium may be used) to build a Colony (Turmoil Unity)';

  canAct(player: Player, game: Game) {
    return player.canAfford(15, game, false, true) && player.hasAvailableColonyTileToBuildOn(game);
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
        player,
        15,
        false,
        true,
        'Select how to pay for colony',
        () => {
          game.defer(new BuildColony(player, game, false, 'Select where to build colony'));
        },
    ));

    return undefined;
  }
}

export class UnityPolicy03 implements Policy {
  id = 'up03';
  description: string = 'Spend 4 MC to draw a Space card (Turmoil Unity)';

  canAct(player: Player) {
    return player.canAfford(4);
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    game.defer(new SelectHowToPayDeferred(
        player,
        4,
        false,
        false,
        'Select how to pay for action',
        () => {
          player.cardsInHand.push(game.drawCardsByTag(Tags.SPACE, 1)[0]);
          const drawnCard = game.getCardsInHandByTag(player, Tags.SPACE).slice(-1)[0];
          game.log('${0} drew ${1}', (b) => b.player(player).card(drawnCard));
        },
    ));

    return undefined;
  }
}

export class UnityPolicy04 implements Policy {
  id = 'up04';
  description: string = 'Cards with Space tags cost 2 MC less to play';
}
