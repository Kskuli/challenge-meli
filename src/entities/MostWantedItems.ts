import "reflect-metadata";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class MostWantedItems {
  @PrimaryColumn("varchar") 
  itemId: string;

  @Column("int", { default: 0 })
  count: number;

  constructor(itemId: string, count: number = 0) {
    this.itemId = itemId;
    this.count = count;
  }
}
