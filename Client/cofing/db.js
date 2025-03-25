import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("library", "postgres", "bourousia", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

try {
  await sequelize.authenticate();
  console.log("connected");
} catch (error) {
  console.log(error);
}

export default sequelize;

// let books = {
//   1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: {
// } },
//   2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: {} },
//   3: { author: "Dante Alighieri", title: "The Divine Comedy", reviews: {} },
//   4: { author: "Unknown", title: "The Epic Of Gilgamesh", reviews: {} },
//   5: { author: "Unknown", title: "The Book Of Job", reviews: {} },
//   6: { author: "Unknown", title: "One Thousand and One Nights", reviews: {} },
//   7: { author: "Unknown", title: "Nj\u00e1l's Saga", reviews: {} },
//   8: { author: "Jane Austen", title: "Pride and Prejudice", reviews: {} },
//   9: {
//     author: "Honor\u00e9 de Balzac",
//     title: "Le P\u00e8re Goriot",
//     reviews: {},
//   },
//   10: {
//     author: "Samuel Beckett",
//     title: "Molloy, Malone Dies, The Unnamable, the trilogy",
//     reviews: {},
//   },
// };

// export default books;
