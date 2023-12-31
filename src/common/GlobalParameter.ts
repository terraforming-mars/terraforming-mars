import {match} from 'ts-pattern';

export enum GlobalParameter {
  OCEANS = 'oceans',
  OXYGEN = 'oxygen',
  TEMPERATURE = 'temperature',
  VENUS = 'venus',
  MOON_HABITAT_RATE = 'moon-habitat',
  MOON_MINING_RATE = 'moon-mining',
  MOON_LOGISTICS_RATE = 'moon-logistics',
}

export const GLOBAL_PARAMETERS = [
  GlobalParameter.OCEANS,
  GlobalParameter.OXYGEN,
  GlobalParameter.TEMPERATURE,
  GlobalParameter.VENUS,
  GlobalParameter.MOON_HABITAT_RATE,
  GlobalParameter.MOON_MINING_RATE,
  GlobalParameter.MOON_LOGISTICS_RATE,
] as const;

export interface GlobalParameterLimits {
  minimum: number,
  maximum: number,
  scale: number,
}

export function getGlobalParameterLimits(globalParameter: GlobalParameter): GlobalParameterLimits {
  return match(globalParameter)
    .with(GlobalParameter.OCEANS, () => {
      return {minimum: 0, maximum: 9, scale: 1};
    })
    .with(GlobalParameter.OXYGEN, () => {
      return {minimum: 0, maximum: 14, scale: 1};
    })
    .with(GlobalParameter.TEMPERATURE, () => {
      return {minimum: -30, maximum: 8, scale: 2};
    })
    .with(GlobalParameter.VENUS, () => {
      return {minimum: 0, maximum: 30, scale: 2};
    })
    .with(GlobalParameter.MOON_HABITAT_RATE, () => {
      return {minimum: 0, maximum: 8, scale: 1};
    })
    .with(GlobalParameter.MOON_MINING_RATE, () => {
      return {minimum: 0, maximum: 8, scale: 1};
    })
    .with(GlobalParameter.MOON_LOGISTICS_RATE, () => {
      return {minimum: 0, maximum: 8, scale: 1};
    })
    .exhaustive();
}
