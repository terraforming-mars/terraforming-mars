import {IParty} from './IParty';
import {Party} from './Party';
import {PartyName} from '../../../common/turmoil/PartyName';
import {IGame} from '../../IGame';
import {Tag} from '../../../common/cards/Tag';
import {Resource} from '../../../common/Resource';
import {Bonus} from '../Bonus';
import {SpaceType} from '../../../common/boards/SpaceType';
import {Space} from '../../boards/Space';
import {IPlayer} from '../../IPlayer';
import {Policy} from '../Policy';
import {Phase} from '../../../common/Phase';
import {SelectPaymentDeferred} from '../../deferredActions/SelectPaymentDeferred';
import {IProjectCard} from '../../cards/IProjectCard';
import {POLITICAL_AGENDAS_MAX_ACTION_USES} from '../../../common/constants';
import {TITLES} from '../../inputs/titles';

export class MarsFirst extends Party implements IParty {
  readonly name = PartyName.MARS;
  readonly bonuses = [MARS_FIRST_BONUS_1, MARS_FIRST_BONUS_2];
  readonly policies = [MARS_FIRST_POLICY_1, MARS_FIRST_POLICY_2, MARS_FIRST_POLICY_3, MARS_FIRST_POLICY_4];
}

// TODO(nwai90): Mars First bonus IDs start with 'm' and policies start with 'mp'.
class MarsFirstBonus01 implements Bonus {
  readonly id = 'mb01' as const;
  readonly description = 'Gain 1 M€ for each building tag you have';

  getScore(player: IPlayer) {
    return player.tags.count(Tag.BUILDING, 'raw');
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class MarsFirstBonus02 implements Bonus {
  readonly id = 'mb02' as const;
  readonly description = 'Gain 1 M€ for each tile you have ON MARS';

  getScore(player: IPlayer) {
    const boardSpaces = player.game.board.spaces;
    return boardSpaces.filter((space) => space.tile !== undefined && space.player === player && space.spaceType !== SpaceType.COLONY).length;
  }

  grant(game: IGame) {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.stock.add(Resource.MEGACREDITS, this.getScore(player));
    });
  }
}

class MarsFirstPolicy01 implements Policy {
  readonly id = 'mfp01' as const;
  readonly description = 'When you place a tile ON MARS, gain 1 steel';

  onTilePlaced(player: IPlayer, space: Space) {
    if (space.tile && space.spaceType !== SpaceType.COLONY && player.game.phase === Phase.ACTION) {
      player.stock.add(Resource.STEEL, 1);
    }
  }
}

class MarsFirstPolicy02 implements Policy {
  readonly id = 'mfp02' as const;
  readonly description = 'When you play a building tag, gain 2 M€';

  onCardPlayed(player: IPlayer, card: IProjectCard) {
    if (card.tags.includes(Tag.BUILDING)) player.stock.add(Resource.MEGACREDITS, 2);
  }
}

class MarsFirstPolicy03 implements Policy {
  readonly id = 'mfp03' as const;
  readonly description = 'Your steel resources are worth 1 M€ extra';

  onPolicyStart(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.increaseSteelValue();
    });
  }
  onPolicyEnd(game: IGame): void {
    game.getPlayersInGenerationOrder().forEach((player) => {
      player.decreaseSteelValue();
    });
  }
}

class MarsFirstPolicy04 implements Policy {
  readonly id = 'mfp04' as const;
  readonly description = 'Spend 4 M€ to draw a Building card (Turmoil Mars First)';

  canAct(player: IPlayer) {
    return player.canAfford(4) && player.politicalAgendasActionUsedCount < POLITICAL_AGENDAS_MAX_ACTION_USES;
  }

  action(player: IPlayer) {
    const game = player.game;
    game.log('${0} used Turmoil Mars First action', (b) => b.player(player));
    player.politicalAgendasActionUsedCount += 1;

    game.defer(new SelectPaymentDeferred(player, 4, {title: TITLES.payForPartyAction(PartyName.MARS)}))
      .andThen(() => player.drawCard(1, {tag: Tag.BUILDING}));
    return undefined;
  }
}

export const MARS_FIRST_BONUS_1 = new MarsFirstBonus01();
export const MARS_FIRST_BONUS_2 = new MarsFirstBonus02();
export const MARS_FIRST_POLICY_1 = new MarsFirstPolicy01();
export const MARS_FIRST_POLICY_2 = new MarsFirstPolicy02();
export const MARS_FIRST_POLICY_3 = new MarsFirstPolicy03();
export const MARS_FIRST_POLICY_4 = new MarsFirstPolicy04();
