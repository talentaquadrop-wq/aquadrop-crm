const express = require("express");
const router = express.Router();

const controller = require("../controllers/dispatchController");

console.log(controller);

router.get("/stats", controller.getDispatchStats);

router.get("/", controller.getDispatches);

router.post("/", controller.addDispatch);

router.put("/:id", controller.updateDispatch);

router.delete("/:id", controller.deleteDispatch);

module.exports = router;