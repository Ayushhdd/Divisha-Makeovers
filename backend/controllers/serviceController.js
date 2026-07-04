import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  const { search, category } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (search) {
    filter.$text = { $search: search };
  }

  const services = await Service.find(filter).sort({ category: 1, name: 1 });
  res.json(services);
};

export const getAllServices = async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
};

export const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
};

export const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};

export const updateService = async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
};

export const deleteService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  service.isActive = false;
  await service.save();
  res.json({ message: 'Service deactivated' });
};

export const hardDeleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ message: 'Service deleted' });
};
