import { Terraformer } from "./Terraformer";
import { Mayor } from "./Mayor";
import { Gardener } from "./Gardener";
import { Builder } from "./Builder";
import { Planner } from "./Planner";
import { Hoverlord } from "./Hoverlord"
import { IMilestone } from "./IMilestone";
import { Generalist } from './Generalist';

export const ORIGINAL_MILESTONES: Array<IMilestone> = [
    new Terraformer(),
    new Mayor(),
    new Gardener(),
    new Builder(),
    new Planner(),
]

export const VENUS_MILESTONES: Array<IMilestone> = [
    new Hoverlord()
]

export const ELYSIUM_MILESTONES: Array<IMilestone> = [
    new Generalist()
]    