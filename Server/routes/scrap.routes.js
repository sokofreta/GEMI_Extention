import { Router } from "express";
import ScrapeTool from "../scrapedata/ordinoService.js";

const router = Router();
router.post("/actors", async (req, res) => {
  const { range, stop } = req.body;
  try {
    if (stop) {
      res.json({ message: "Scraping stopped." });
    }
    const service = new ScrapeTool();
    const data = await service.scrapeDataForActorRange(range.start, range.end);
    res.json(data);
  } catch (error) {
    console.error("Error while scraping:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/movies", async (req, res) => {
  try {
    const { range, stop } = req.body;
    const service = new ScrapeTool();

    if (stop) {
      return res.json({ message: "Scraping stopped." });
    }
    const result = await service.getVenues(5000);
    res.json({
      message: "Scraping movies completed successfully!",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



export const scrapRoutes = router;
