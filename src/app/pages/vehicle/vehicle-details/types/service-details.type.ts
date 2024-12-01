import {Cost} from "./cost.type";

export type ServiceDetails = {
  id: string,
  title: string,
  description: string,
  date: Date,
  costs: Cost[];
}
