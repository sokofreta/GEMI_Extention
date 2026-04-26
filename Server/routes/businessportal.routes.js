import { Router } from "express";
const router = Router();
import { BusinessPortalService } from "../scrapedata/businessPortalService.js";

router.get("/business", async (req, res) => {
  try {
    const data = req.query;
    const {
      startDate,
      endDate,
      delay,
      tk,
      region,
      status,
      oneToOne,
      activities,
    } = data;

    const service = new BusinessPortalService(
      startDate,
      endDate,
      delay,
      tk,
      region,
      status,
      oneToOne,
      activities
    );
    const result = await service.getBusinessPortalData(
      startDate,
      endDate,
      delay,
      oneToOne
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//get scraped ids
router.get("/ids", async (req, res) => {
  try {
    const service = new BusinessPortalService();
    const result = await service.getBusinessPortalIds();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//scrapping business portal details
router.get("/details", async (req, res) => {
  try {
    const service = new BusinessPortalService();
    const { limit, page, delay } = req.query;
    const result = await service.getBusinessPortalDetails(limit, page, delay);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});
//get business portal info
router.get("info", async (req, res) => {
  try {
    const service = new BusinessPortalService();
    const result = await service.getBusinessPortalDetails();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

//get specific Business by id.
router.get("/businessid" , async (req,res) =>{
  try {
    const businesses = await BusinessModel.find({companyNumber:req.query.id})
    res.json(businesses)
  }
  catch (err){
    console.log(err)
    res.status(500).json({error : "Internal server error"})
  }
})
export const businessPortalRoutes = router;
