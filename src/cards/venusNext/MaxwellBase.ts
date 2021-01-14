import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceName} from '../../SpaceName';
import {SpaceType} from '../../SpaceType';
import {Resources} from '../../Resources';
import {IActionCard, ICard} from '../ICard';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class MaxwellBase implements IActionCard, IProjectCard {
    public cost = 18;
    public tags = [Tags.CITY, Tags.VENUS];
    public name = CardName.MAXWELL_BASE;
    public cardType = CardType.ACTIVE;
    public canPlay(player: Player, game: Game): boolean {
      return player.getProduction(Resources.ENERGY) >= 1 && game.checkMinRequirements(player, GlobalParameter.VENUS, 12);
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -1);
      game.addCityTile(player, SpaceName.MAXWELL_BASE, SpaceType.COLONY);
      return undefined;
    }
    public getVictoryPoints() {
      return 3;
    }

    public getResCards(player: Player): ICard[] {
      let resourceCards = player.getResourceCards(ResourceType.FLOATER);
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.MICROBE));
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
      return resourceCards.filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
    }

    public canAct(player: Player): boolean {
      return this.getResCards(player).length > 0;
    }

    public action(player: Player) {
      const cards = this.getResCards(player);

      if (cards.length === 1) {
        player.addResourceTo(cards[0], 1);
        LogHelper.logAddResource(player, cards[0]);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 resource',
        'Add resource',
        cards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(player, foundCards[0]);
          return undefined;
        },
      );
    }
    public metadata: CardMetadata = {
      cardNumber: '238',
      requirements: CardRequirements.builder((b) => b.venus(12)),
      renderData: CardRenderer.builder((b) => {
        b.action('Add 1 resource to ANOTHER VENUS CARD.', (eb) => {
          eb.empty().startAction.wild(1).secondaryTag(Tags.VENUS);
        }).br;
        b.production((pb) => pb.minus().energy(1)).nbsp.city().asterix();
      }),
      description: {
        text: 'Requires Venus 12%. Decrease your energy production 1 step. Place a City tile ON THE RESERVED AREA.',
        align: 'left',
      },
      victoryPoints: 3,
    };
}
