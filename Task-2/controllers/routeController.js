const Route = require("../models/routeSchema");

const addRoute = async (req, res) => {
  try {
    const { busId, startPoint, endPoint, stops, distance, estimatedTime } =
      req.body;

    const busExists = await Bus.findById(busId);
    if (!busExists) {
      return res.status(404).json({ message: "Bus not found" });
    }

    const newRoute = new Route({
      busId,
      startPoint,
      endPoint,
      stops,
      distance,
      estimatedTime,
    });

    await newRoute.save();
    return res
      .status(201)
      .json({ message: "Route added successfully", route: newRoute });
  } catch (error) {
    console.error("Error adding route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { startPoint, endPoint, stops, distance, estimatedTime } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.startPoint = startPoint || route.startPoint;
    route.endPoint = endPoint || route.endPoint;
    route.stops = stops || route.stops;
    route.distance = distance || route.distance;
    route.estimatedTime = estimatedTime || route.estimatedTime;

    await route.save();
    return res
      .status(200)
      .json({ message: "Route updated successfully", route });
  } catch (error) {
    console.error("Error updating route:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addRoute, updateRoute };