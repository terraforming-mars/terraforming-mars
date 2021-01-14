import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {IActionCard} from '../ICard';
import {Resources} from '../../Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Factorum implements IActionCard, CorporationCard {
    public name = CardName.FACTORUM;
    public tags = [Tags.ENERGY, Tags.BUILDING];
    public startingMegaCredits: number = 37;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      return undefined;
    }

    public canAct(player: Player): boolean {
      return player.energy === 0 || player.canAfford(3);
    }

    public action(player: Player) {
      const increaseEnergy = new SelectOption(
        'Increase your energy production 1 step',
        'Increase production',
        () => {
          player.addProduction(Resources.ENERGY);
          LogHelper.logGainProduction(player, Resources.ENERGY);
          return undefined;
        },
      );

      const drawBuildingCard = new SelectOption('Spend 3 MC to draw a building card', 'Draw card', () => {
        player.megaCredits -= 3;
        player.drawCard(1, {tag: Tags.BUILDING});
        return undefined;
      });

      if (player.energy > 0) return drawBuildingCard;
      if (!player.canAfford(3)) return increaseEnergy;

      return new OrOptions(increaseEnergy, drawBuildingCard);
    }

    public metadata: CardMetadata = {
      cardNumber: 'R22',
      description: 'You start with 37 MC. Increase your steel production 1 step.',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(37).nbsp.production((pb) => pb.steel(1));
        b.corpBox('action', (ce) => {
          ce.vSpace(CardRenderItemSize.LARGE);
          ce.action('Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3MC to draw a building card.', (eb) => {
            eb.empty().arrow().production((pb) => pb.energy(1));
            eb.or().megacredits(3).startAction.cards(1).secondaryTag(Tags.BUILDING);
          });
        });
      }),
    }
}
