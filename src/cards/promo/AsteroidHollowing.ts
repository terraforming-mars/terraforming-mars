import {IProjectCard} from '../IProjectCard';
import {IActionCard, IResourceCard} from '../ICard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {ResourceType} from '../../ResourceType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Resources} from '../../Resources';
import {Game} from '../../Game';
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class AsteroidHollowing implements IActionCard, IProjectCard, IResourceCard {
  public name = CardName.ASTEROID_HOLLOWING;
  public cost = 16;
  public tags = [Tags.SPACE];
  public resourceType = ResourceType.ASTEROID;
  public resourceCount: number = 0;
  public cardType = CardType.ACTIVE;

  public play() {
    return undefined;
  }

  public canAct(player: Player): boolean {
    return player.titanium > 0;
  }

  public action(player: Player, game: Game) {
    player.titanium -= 1;
    player.addProduction(Resources.MEGACREDITS);
    player.addResourceTo(this);
    LogHelper.logAddResource(game, player, this);

    return undefined;
  }

  public getVictoryPoints(): number {
    return Math.floor(this.resourceCount / 2);
  }

  public metadata: CardMetadata = {
    cardNumber: 'X13',
    description: '1VP for each 2 asteroids on this card',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.titanium(1).startAction.asteroids(1).productionBox((pb) => pb.megacredits(1));
        eb.description('Action: Spend 1 titanium to add 1 asteroid resource here and increase MC production 1 step');
      });
    }),
    victoryPoints: CardRenderDynamicVictoryPoints.asteroids(1, 2),
  }
}
