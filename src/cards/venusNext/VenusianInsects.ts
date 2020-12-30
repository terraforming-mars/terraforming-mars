import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class VenusianInsects implements IActionCard, IProjectCard, IResourceCard {
    public cost = 5;
    public tags = [Tags.VENUS, Tags.MICROBE];
    public name = CardName.VENUSIAN_INSECTS;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.MICROBE;
    public resourceCount: number = 0;
    public canPlay(player: Player, game: Game): boolean {
      return game.getVenusScaleLevel() >= 12 - (2 * player.getRequirementsBonus(game, true));
    }
    public play() {
      return undefined;
    }
    public canAct(): boolean {
      return true;
    }
    public action(player: Player) {
      player.addResourceTo(this);
      return undefined;
    }
    public getVictoryPoints(): number {
      return Math.floor(this.resourceCount / 2);
    }
    public metadata: CardMetadata = {
      cardNumber: '260',
      requirements: CardRequirements.builder((b) => b.venus(12)),
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb)=> {
          eb.empty().startAction.microbes(1);
          eb.description('Action: add 1 Microbe to this card.');
        }).br;
        b.text('1 VP for every 2nd Microbe on this card.', CardRenderItemSize.TINY, true);
      }),
      description: 'Requires Venus 12%.',
      victoryPoints: CardRenderDynamicVictoryPoints.microbes(1, 2),
    }
}
