const router = require("express").Router();
const { Op } = require("sequelize");
const { User, Pet, Kennel, Reservations } = require("../models");

// use withAuth middleware to redirect from protected routes.
const withAuth = require("../util/withAuth");

// example of a protected route
// router.get("/users-only", withAuth, (req, res) => {
//   // ...
// });

router.get("/", async (req, res) => {
  try {
    res.render("home", {
      isLoggedIn: req.session.isLoggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Log-In Page" });
});

router.get("/signup", (req, res) => {
  res.render("signup", { title: "Sign-Up Page" });
});

router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.userId, {
      attributes: { exclude: ["password"] },
      include: [{ model: Pet }],
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/aboutus", (req, res) => {
  try {
    res.render("aboutus");
  } catch (err) {
    console.error(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/reservation/dates", (req, res) => {
  try {
    res.render("reserve-calendar");
  } catch (err) {
    console.error(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/reservation/kennel", async (req, res) => {
  try {
    const start = "2021-08-12";
    const end = "2021-08-13";
    const kennelData = await Kennel.findAll({
      include: [
        {
          model: Reservations,
          as: "reservations",
        },
      ],
    });

    const kennels = kennelData.map((k) => {
      return {
        ...k.get({ plain: true }),
        availability: k.availability(start, end),
      };
    });
    console.log(kennels);
    res.render("reserve-kennel", {
      kennels,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

router.get("/reservation-lists", (req, res) => {
  try {
    res.render("reservation-lists");
  } catch (err) {
    console.error(err);
    res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
  }
});

// router.get("/", async (req, res) => {
//   try {
//     let user;
//     if (req.session.isLoggedIn) {
//       user = await User.findByPk(req.session.userId, {
//         exclude: ["password"],
//         raw: true,
//       });
//     }
//     res.render("home", {
//       title: "Home Page",
//       isLoggedIn: req.session.isLoggedIn,
//       user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("⛔ Uh oh! An unexpected error occurred.");
//   }
// });

// router.get("/login", (req, res) => {
//   res.render("login", { title: "Log-In Page" });
// });

// router.get("/signup", (req, res) => {
//   res.render("signup", { title: "Sign-Up Page" });
// });

module.exports = router;
