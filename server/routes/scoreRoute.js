import express, { request, response } from "express";
import { score } from "../models/scoreModel.js";

const router = express.Router();

// Get all scores
router.get("/", async (req, res) => {
  try {
    const scores = await Score.find({});

    return response.status(200).json({
      count: scores.length,
      data: scores,
    });
  } catch (err) {
    console.error(err);
    response.status(500).send({ message: err.message });
  }
});

// get a score
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const score = await Score.findById(id);

    if (!score) {
      return response.status(404).send({ message: "Score not found" });
    }
    return response.status(200).json(score);
  } catch (err) {
    console.log(err);
    response.status(500).send({ message: err.message });
  }
});

// create a score
router.post("/", async (req, res) => {
  try {
    if (!req.body.userId || !req.body.value) {
      return response
        .status(400)
        .send({ message: "Please send all required fields: userId, value" });
    }

    // create a new score

    const newScore = {
      userId: req.body.userId,
      value: req.body.value,
    };

    const score = await Score.create(newScore);
    return response.status(200).send(score);
  } catch (err) {
    console.log(err);
    response.status(500).send({ message: err.message });
  }
});

// update a score
router.put("/:id", async (req, res) => {
  try {
    if (!req.body.userId || !req.body.value) {
      return res
        .status(400)
        .send({ message: "Please send all required fields : userId, value." });
    }

    // attempt to update score information
    const { id } = request.params;
    const result = await Score.findByIdAndUpdate(id, req.body);

    if (!result) {
      return response
        .status(404)
        .send({ message: "Update failed. Score not found" });
    }

    return response.status(200).send({ message: "Score updated successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).send({ message: err.message });
  }
});

// delete a score
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Score.findByIdAndDelete(id);

    if (!result) {
      return response.status(404).send({ message: "Score not found" });
    }
    return response.status(200).send({ message: "Score deleted successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).send({ message: err.message });
  }
});

export default router;
