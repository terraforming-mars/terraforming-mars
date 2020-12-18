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
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../constants';

export class Unity extends Party implements IParty {
  name = PartyName.UNITY;
  description: string = 'Wants to see humanity prosper in the whole solar system.';
  bonuses = [new UnityBonus01(), new UnityBonus02()];
  policies = [new UnityPolicy01(), new UnityPolicy02(), new UnityPolicy03(), new UnityPolicy04()];
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
  description: string = 'Spend 9 MC to gain 4 titanium';

  canAct(player: Player) {
    return player.canAfford(9) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;
    game.defer(new SelectHowToPayDeferred(
      player,
      9,
      false,
      false,
      'Select how to pay for action',
      () => {
        player.setResource(Resources.TITANIUM, 4);
        game.log('${0} gained 4 titanium', (b) => b.player(player));
      },
    ));

    return undefined;
  }
}

export class UnityPolicy03 implements Policy {
  id = 'up03';
  description: string = 'Spend 4 MC to draw a Space card (Turmoil Unity)';

  canAct(player: Player) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player, game: Game) {
    game.log('${0} used Turmoil Unity action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

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
