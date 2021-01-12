import {Tags} from '../Tags';
import {Player} from '../../Player';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectOption} from '../../inputs/SelectOption';
import {OrOptions} from '../../inputs/OrOptions';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {ICard} from '../ICard';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardType} from '../CardType';
import {DeferredAction} from '../../deferredActions/DeferredAction';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class PharmacyUnion implements CorporationCard {
    public name = CardName.PHARMACY_UNION;
    public tags = [Tags.MICROBE, Tags.MICROBE];
    public startingMegaCredits: number = 46; // 54 minus 8 for the 2 deseases
    public resourceType = ResourceType.DISEASE;
    public cardType = CardType.CORPORATION;
    public resourceCount: number = 0;
    public isDisabled: boolean = false;

    public play(player: Player) {
      this.resourceCount = 2;
      player.drawCard(1, {tag: Tags.SCIENCE});
      return undefined;
    }

    public onCardPlayed(player: Player, game: Game, card: IProjectCard): void {
      if (this.isDisabled) return undefined;

      const hasScienceTag = card.tags.includes(Tags.SCIENCE);
      const hasMicrobesTag = card.tags.includes(Tags.MICROBE);
      const isPharmacyUnion = player.isCorporation(CardName.PHARMACY_UNION);
      const redsAreRuling = PartyHooks.shouldApplyPolicy(game, PartyName.REDS);

      // Edge case, let player pick order of resolution (see https://github.com/bafolts/terraforming-mars/issues/1286)
      if (isPharmacyUnion && hasScienceTag && hasMicrobesTag && this.resourceCount === 0) {
        // TODO (Lynesth): Modify this when https://github.com/bafolts/terraforming-mars/issues/1670 is fixed
        if (!redsAreRuling || redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST * 3) === true) {
          game.defer(new DeferredAction(
            player,
            () => {
              const orOptions = new OrOptions(
                new SelectOption('Turn it face down to gain 3 TR and lose up to 4 MC', 'Confirm', () => {
                  const megaCreditsLost = Math.min(player.megaCredits, 4);
                  this.isDisabled = true;
                  player.increaseTerraformRatingSteps(3, game);
                  player.megaCredits -= megaCreditsLost;
                  game.log('${0} turned ${1} face down to gain 3 TR and lost ${2} MC', (b) => b.player(player).card(this).number(megaCreditsLost));
                  return undefined;
                }),
                new SelectOption('Add a disease to it and lose up to 4 MC, then remove a disease to gain 1 TR', 'Confirm', () => {
                  const megaCreditsLost = Math.min(player.megaCredits, 4);
                  player.increaseTerraformRating(game);
                  player.megaCredits -= megaCreditsLost;
                  game.log('${0} added a disease to ${1} and lost ${2} MC', (b) => b.player(player).card(this).number(megaCreditsLost));
                  game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
                  return undefined;
                }),
              );
              orOptions.title = 'Choose the order of tag resolution for Pharmacy Union';
              return orOptions;
            },
          ), true); // Make it a priority
          return undefined;
        }
      }


      if (isPharmacyUnion && hasScienceTag) {
        const scienceTags = card.tags.filter((tag) => tag === Tags.SCIENCE).length;
        for (let i = 0; i < scienceTags; i++) {
          game.defer(new DeferredAction(
            player,
            () => {
              if (this.isDisabled) return undefined;

              if (this.resourceCount > 0) {
                if (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST) === false) {
                  // TODO (Lynesth): Remove this when #1670 is fixed
                  game.log('${0} cannot remove a disease from ${1} to gain 1 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
                } else {
                  this.resourceCount--;
                  player.increaseTerraformRating(game);
                  game.log('${0} removed a disease from ${1} to gain 1 TR', (b) => b.player(player).card(this));
                }
                return undefined;
              }

              if (redsAreRuling && player.canAfford(REDS_RULING_POLICY_COST * 3) === false) {
                // TODO (Lynesth): Remove this when #1670 is fixed
                game.log('${0} cannot turn ${1} face down to gain 3 TR because of unaffordable Reds policy cost', (b) => b.player(player).card(this));
                return undefined;
              }

              return new OrOptions(
                new SelectOption('Turn this card face down and gain 3 TR', 'Gain TR', () => {
                  this.isDisabled = true;
                  player.increaseTerraformRatingSteps(3, game);
                  game.log('${0} turned ${1} face down to gain 3 TR', (b) => b.player(player).card(this));
                  return undefined;
                }),
                new SelectOption('Do nothing', 'Confirm', () => {
                  return undefined;
                }),
              );
            },
          ), true); // Make it a priority
        }
      }


      if (hasMicrobesTag) {
        game.defer(new DeferredAction(
          player,
          () => {
            const microbeTagCount = card.tags.filter((cardTag) => cardTag === Tags.MICROBE).length;
            const player = game.getPlayers().find((p) => p.isCorporation(this.name))!;
            const megaCreditsLost = Math.min(player.megaCredits, microbeTagCount * 4);
            player.addResourceTo(this, microbeTagCount);
            player.megaCredits -= megaCreditsLost;
            game.log('${0} added a disease to ${1} and lost ${2} MC', (b) => b.player(player).card(this).number(megaCreditsLost));
            return undefined;
          },
        ), true); // Make it a priority
      }

      return undefined;
    }

    public onCorpCardPlayed(player: Player, game: Game, card: CorporationCard) {
      return this.onCardPlayed(player, game, card as ICard as IProjectCard);
    }

    public metadata: CardMetadata = {
      cardNumber: 'R39',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(54).cards(1).secondaryTag(Tags.SCIENCE);
        // blank space after MC is on purpose
        b.text('(You start with 54 MC . When this corporation is revealed, draw a Science card.)', CardRenderItemSize.TINY, false, false);
        b.corpBox('effect', (ce) => {
          ce.vSpace(CardRenderItemSize.LARGE);
          ce.effect(undefined, (eb) => {
            eb.microbes(1).any.played.startEffect.disease().megacredits(-4);
          });
          ce.vSpace();
          ce.effect('When ANY microbe tag is played, add a disease here and lose 4 MC. When you play a science tag, remove a disease here and gain 1 TR OR if there are no diseases here, you may turn this card face down to gain 3 TR', (eb) => {
            eb.science(1).played.startEffect.minus().disease();
            eb.tr(1, CardRenderItemSize.SMALL).slash().tr(3, CardRenderItemSize.SMALL).digit;
          });
        });
      }),
    }
}
