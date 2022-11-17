var express = require("express");
const contactModel = require("../models/contact");
var router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const contacts = await contactModel.find({});
    res.render("form", { title: "Contacts list", cont: contacts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async function (req, res, next) {
  const { FullName, Phone } = req.body;
  const contact = new contactModel({
    FullName,
    Phone,
  });
  try {
    await contact.save();
    res.redirect("/contacts");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const checkIfExist = await contactModel.findById(id);
    if (!checkIfExist) {
      throw new Error("Contact not found");
    }
    await contactModel.findByIdAndDelete(id);
    res.redirect("/contacts");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/edit/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const contact = await contactModel.findById(id);
        if (!contact) {
            throw new Error("Contact not found");
        }
        res.render("edit", { title: "Edit contact", cont: contact });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.post("/edit/:id", async function (req, res, next) {
    try {
        const { id } = req.params;
        const { FullName, Phone } = req.body;
        const contact = await contactModel.findByIdAndUpdate(id, { FullName, Phone });
        if (!contact) {
            throw new Error("Error while updating contact");
        }
        res.redirect("/contacts");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get("/search", async function (req, res, next) {
    try {
        //object destructuring
        const { search } = req.query;
        const contacts = await contactModel.find({ FullName: { $regex: search, $options: "i" } });
        res.status(200).json({contacts});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
