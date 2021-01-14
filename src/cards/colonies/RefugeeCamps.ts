import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {Resources} from '../../Resources';
import {IResourceCard} from '../ICard';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class RefugeeCamps implements IProjectCard, IResourceCard {
    public cost = 10;
    public tags = [Tags.EARTH];
    public name = CardName.REFUGEE_CAMP;
    public cardType = CardType.ACTIVE;
    public resourceType = ResourceType.CAMP;
    public resourceCount: number = 0;

    public canAct(player: Player): boolean {
      return player.getProduction(Resources.MEGACREDITS) >= -4;
    }

    public action(player: Player) {
      player.addProduction(Resources.MEGACREDITS, -1);
      this.resourceCount++;
      return undefined;
    }

    public play() {
      return undefined;
    }

    public getVictoryPoints(): number {
      return this.resourceCount;
    }

    public metadata: CardMetadata = {
      cardNumber: 'C33',
      renderData: CardRenderer.builder((b) => {
        b.action('Decrease your MC production 1 step to add a camp resource to this card.', (eb) => {
          eb.production((pb) => pb.megacredits(1));
          eb.startAction.camps();
        }).br;
        b.vpText('1 VP for each camp resource on this card.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.camps(1, 1),
    }
}

