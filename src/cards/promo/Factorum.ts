import {CorporationCard} from '../corporation/CorporationCard';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {Game} from '../../Game';
import {IActionCard} from '../ICard';
import {Resources} from '../../Resources';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {LogHelper} from '../../components/LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class Factorum implements IActionCard, CorporationCard {
    public name = CardName.FACTORUM;
    public tags = [Tags.ENERGY, Tags.STEEL];
    public startingMegaCredits: number = 37;
    public cardType = CardType.CORPORATION;

    public play(player: Player) {
      player.addProduction(Resources.STEEL);
      return undefined;
    }

    public canAct(player: Player): boolean {
      return player.energy === 0 || player.canAfford(3);
    }

    public action(player: Player, game: Game) {
      const increaseEnergy = new SelectOption(
        'Increase your energy production 1 step',
        'Increase production',
        () => {
          player.addProduction(Resources.ENERGY);
          LogHelper.logGainProduction(game, player, Resources.ENERGY);
          return undefined;
        },
      );

      const drawBuildingCard = new SelectOption('Spend 3 MC to draw a building card', 'Draw card', () => {
        player.megaCredits -= 3;
        player.cardsInHand.push(game.drawCardsByTag(Tags.STEEL, 1)[0]);

        const drawnCard = game.getCardsInHandByTag(player, Tags.STEEL).slice(-1)[0];

        game.log('${0} drew ${1}', (b) => b.player(player).card(drawnCard));

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
        b.megacredits(37).nbsp.productionBox((pb) => pb.steel(1));
        b.corpBox('action', (ce) => {
          ce.vSpace(CardRenderItemSize.LARGE);
          ce.effectBox((eb) => {
            eb.empty().arrow().productionBox((pb) => pb.energy(1));
            eb.or().megacredits(3).startAction.cards(1).secondaryTag(Tags.STEEL);
            eb.description('Action: Increase your energy production 1 step IF YOU HAVE NO ENERGY RESOURCES, or spend 3MC to draw a building card.');
          });
        });
      }),
    }
}
