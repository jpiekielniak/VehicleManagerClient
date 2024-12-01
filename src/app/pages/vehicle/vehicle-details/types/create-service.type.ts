import {Cost} from "../components/create-service/create-service.component";

export type CreateService = {
  title: string,
  description: string,
  date: Date,
  costs: Cost[]
}
