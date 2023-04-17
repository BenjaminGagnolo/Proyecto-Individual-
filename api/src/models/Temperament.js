const { DataTypes } = require('sequelize');
// export a function that defines the model (arrow function)
// connect to sequelize
module.exports = (sequelize) => {
  // I define a model
  sequelize.define('temperament', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    }
  }, {
    timestamps: false,
    freezeTableName: true, 
  });
};