const { Model, DataTypes, Op } = require("sequelize");
const sequelize = require("../config/connection");

const parseDate = (s) => {
  // eslint-disable-next-line prefer-const
  let [year, month, day] = s.split("-");
  month -= 1;
  return new Date(year, month, day);
};

class Kennel extends Model {
  availability(start, end) {
    if (!this.reservations) {
      throw new Error(
        "Must 'include' reservations before checking availability."
      );
    }
    const startDate = parseDate(start);
    const endDate = parseDate(end);
    const date = new Date(startDate);
    let minAvailability = this.capacity;
    while (date <= endDate) {
      let availability = this.capacity;
      for (let i = 0; i < this.reservations.length; i += 1) {
        const r = this.reservations[i];
        if (parseDate(r.startDate) <= date && parseDate(r.endDate) >= date) {
          availability -= 1;
        }
        if (availability === 0) {
          return 0;
        }
      }
      if (availability < minAvailability) {
        minAvailability = availability;
      }
      date.setDate(date.getDate() + 1);
    }
    return minAvailability;
  }
}

Kennel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: "kennel",
  }
);

module.exports = Kennel;
