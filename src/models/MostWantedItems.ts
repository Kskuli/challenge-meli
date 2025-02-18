import { DataTypes, Model } from "sequelize";
import sequelize from "../config/connectionDb";

// Modelo con tipado correcto
export class MostWantedItems extends Model {
  declare id: number;
  declare itemId: string;
  declare count: number;
}

MostWantedItems.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "most_wanted_items",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['itemId'],
      },
    ],
  }
);
