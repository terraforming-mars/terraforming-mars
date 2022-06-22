import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../common/turmoil/PartyName';
import {Game} from '../../Game';
import {Tags} from '../../common/cards/Tags';
import {Resources} from '../../common/Resources';
import {Bonus} from '../Bonus';
import {SpaceType} from '../../common/boards/SpaceType';
import {ISpace} from '../../boards/ISpace';
import {Player} from '../../Player';
import {Policy} from '../Policy';
import {Phase} from '../../common/Phase';
import {SelectHowToPayDeferred} from '../../deferredActions/SelectHowToPayDeferred';
import {IProjectCard} from '../../cards/IProjectCard';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../common/constants';

export class MarsFirst extends Party implements IParty {
  name = PartyName.MARS;
  description = 'Focused on Martian development and independence.';
  bonuses = [MARS_FIRST_BONUS_1, MARS_FIRST_BONUS_2];
  policies = [MARS_FIRST_POLICY_1, MARS_FIRST_POLICY_2, MARS_FIRST_POLICY_3, MARS_FIRST_POLICY_4];
}

// TODO(nwai90): Mars First bonus IDs start with 'm' and policies start with 'mp'.
class MarsFirstBonus01 implements Bonus {
  id = 'mb01' as const;
  description = 'Gain 1 M€ for each Building tag you have';
  isDefault = true;

  getScore(player: Player) {
    return player.getTagCount(Tags.BUILDING, 'raw');
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class MarsFirstBonus02 implements Bonus {
  id = 'mb02' as const;
  description = 'Gain 1 M€ for each tile you have ON MARS';
  isDefault = false;

  getScore(player: Player) {
    const boardSpaces = player.game.board.spaces;
    return boardSpaces.filter((space) => space.tile !== undefined && space.player === player && space.spaceType !== SpaceType.COLONY).length;
  }

  grant(game: Game) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.addResource(Resources.MEGACREDITS, this.getScore(player));
    });
  }
}

class MarsFirstPolicy01 implements Policy {
  isDefault = true;
  id = 'mfp01' as const;
  description: string = 'When you place a tile ON MARS, gain 1 steel';

  onTilePlaced(player: Player, space: ISpace) {
    if (space.tile && space.spaceType !== SpaceType.COLONY && player.game.phase === Phase.ACTION) {
      player.addResource(Resources.STEEL, 1);
    }
  }
}

class MarsFirstPolicy02 implements Policy {
  id = 'mfp02' as const;
  description: string = 'When you play a Building tag, gain 2 M€';
  isDefault = false;

  onCardPlayed(player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.BUILDING)) player.addResource(Resources.MEGACREDITS, 2);
  }
}

class MarsFirstPolicy03 implements Policy {
  id = 'mfp03' as const;
  description: string = 'Your steel resources are worth 1 M€ extra';
  isDefault = false;
}

class MarsFirstPolicy04 implements Policy {
  id = 'mfp04' as const;
  description: string = 'Spend 4 M€ to draw a Building card (Turmoil Mars First)';
  isDefault = false;

  canAct(player: Player) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: Player) {
    const game = player.game;
    game.log('${0} used Turmoil Mars First action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectHowToPayDeferred(
      player,
      4,
      {
        title: 'Select how to pay for Turmoil Mars First action',
        afterPay: () => {
          player.drawCard(1, {tag: Tags.BUILDING});
        },
      },
    ));

    return undefined;
  }
}

export const MARS_FIRST_BONUS_1 = new MarsFirstBonus01();
export const MARS_FIRST_BONUS_2 = new MarsFirstBonus02();
export const MARS_FIRST_POLICY_1 = new MarsFirstPolicy01();
export const MARS_FIRST_POLICY_2 = new MarsFirstPolicy02();
export const MARS_FIRST_POLICY_3 = new MarsFirstPolicy03();
export const MARS_FIRST_POLICY_4 = new MarsFirstPolicy04();
