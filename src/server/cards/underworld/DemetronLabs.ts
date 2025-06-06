import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CorporationCard} from '../corporation/CorporationCard';
import {IPlayer} from '../../IPlayer';
import {SpaceType} from '../../../common/boards/SpaceType';
import {IActionCard, IdentificationTrigger} from '../ICard';
import {SelectSpace} from '../../inputs/SelectSpace';
import {LogHelper} from '../../LogHelper';
import {digit} from '../Options';
import {sum} from '../../../common/utils/utils';
import {Space} from '../../boards/Space';
import {CardResource} from '../../../common/CardResource';
import {AddResourcesToCard} from '../../deferredActions/AddResourcesToCard';
import {ICorporationCard} from '../corporation/ICorporationCard';

export class DemetronLabs extends CorporationCard implements ICorporationCard, IActionCard {
  constructor() {
    super({
      name: CardName.DEMETRON_LABS,
      tags: [Tag.SCIENCE],
      startingMegaCredits: 45,
      resourceType: CardResource.DATA,

      behavior: {
        addResources: 3,
      },

      metadata: {
        cardNumber: 'UC02',
        description: 'You start with 45 M€ and 3 data on this card.',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(45).resource(CardResource.DATA, 3);
          b.br;
          b.effect('After you identify 1 or more underground resources in a single action ' +
            'EXCEPT BY EXCAVATING, put 1 data on ANY card',
          (eb) => eb.text('X').identify().asterix().startEffect.resource(CardResource.DATA).asterix());
          b.br;
          b.action('Spend 3 data here and pick a space on Mars with no tile. ' +
            'Gain its placement bonus, and no adjacency bonuses.',
          (ab) => ab.resource(CardResource.DATA, {amount: 3, digit}).startAction.text('Placement Bonus').asterix());
        }),
      },
    });
  }

  private availableSpaces(player: IPlayer) {
    return player.game.board.spaces
      .filter((space) => space.spaceType !== SpaceType.COLONY && space.tile === undefined);
  }

  public canAct(player: IPlayer) {
    return this.resourceCount >= 3 && this.availableSpaces(player).length > 0;
  }

  public action(player: IPlayer) {
    player.removeResourceFrom(this, 3);
    return new SelectSpace(
      'Select a space to gain its placement bonus',
      this.availableSpaces(player))
      .andThen((space) => {
        LogHelper.logBoardTileAction(player, space, 'selected');
        player.game.grantSpaceBonuses(player, space);
        return undefined;
      });
  }

  // Behavior is similar in Mining Market Insider.
  // This doesn't need to be serialized. It ensures this is only evaluated once per action.
  // When the server restarts, the player has to take an action anyway.
  private lastActionId = -1;
  public onIdentification(identifyingPlayer: IPlayer | undefined, cardOwner: IPlayer, _space: Space, trigger: IdentificationTrigger) {
    if (identifyingPlayer !== cardOwner || trigger === 'excavation') {
      return;
    }
    const actionId = sum(identifyingPlayer.game.getPlayers().map((p) => p.actionsTakenThisGame));
    if (this.lastActionId !== actionId) {
      cardOwner.game.defer(new AddResourcesToCard(cardOwner, CardResource.DATA));
      this.lastActionId = actionId;
    }
  }
}
