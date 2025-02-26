const Bus = require("../models/busSchema");
const Route = require("../models/routeSchema");

const addBus = async (req, res) => {
  try {
    const { busNumber, capacity, route, fare } = req.body;

    const existingBus = await Bus.findOne({ busNumber });
    if (existingBus) {
      return res.status(400).json({ message: "Bus number already exists" });
    }

    const routeExists = await Route.findById(route);
    if (!routeExists) {
      return res.status(404).json({ message: "Route not found" });
    }

    const newBus = new Bus({
      adminId: req.user.id, 
      busNumber,
      capacity,
      route,
      fare,
    });

    await newBus.save();
    return res
      .status(201)
      .json({ message: "Bus added successfully", bus: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const { busNumber, capacity, route, fare } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (bus.adminId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this bus" });
    }

    if (route) {
      const routeExists = await Route.findById(route);
      if (!routeExists) {
        return res.status(404).json({ message: "Route not found" });
      }
    }

    bus.busNumber = busNumber || bus.busNumber;
    bus.capacity = capacity || bus.capacity;
    bus.route = route || bus.route;
    bus.fare = fare || bus.fare;

    await bus.save();
    return res.status(200).json({ message: "Bus updated successfully", bus });
  } catch (error) {
    console.error("Error updating bus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addBus, updateBus };