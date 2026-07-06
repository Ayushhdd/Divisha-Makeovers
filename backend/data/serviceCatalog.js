export const serviceCatalog = [
  {
    _id: '700000000000000000000001',
    name: 'Classic Bridal Package',
    description:
      'A timeless bridal look with traditional techniques, bridal hairstyling, eyelashes, coloured lenses, outfit draping, and hair extensions if needed.',
    category: 'Bridal Makeup',
    price: 16500,
    duration: 180,
    isActive: true,
  },
  {
    _id: '700000000000000000000002',
    name: 'Ultra Radiant HD Waterproof Bridal Makeup Package',
    description:
      'High-end products used: MAC, PAC, Too Faced Born This Way, Sephora and more. Includes HD waterproof bridal makeup, 24 hours stay guarantee, bridal lashes, lenses, hairstyle, draping, and fresh flower accessories.',
    category: 'Bridal Makeup',
    price: 18500,
    duration: 180,
    isActive: true,
  },
  {
    _id: '700000000000000000000003',
    name: 'Signature Silk Bridal Makeup',
    description:
      'Premium international brands like NARS, Tarte, Huda Beauty, Laura Mercier, Charlotte Tilbury and more. Includes advanced hairstyle, hair extensions if required, fresh flower accessories, draping, premium lashes, premium lenses, free nail extensions, free bridal reel, and one free party makeup function offer.',
    category: 'Bridal Makeup',
    price: 24999,
    duration: 180,
    isActive: true,
  },
  {
    _id: '700000000000000000000004',
    name: 'Signature High Definition (HD) Engagement/Reception Makeup Package',
    description:
      'Premium high-definition engagement or reception makeup with advanced hairstyling, luxury lashes, hair extensions, outfit draping, premium coloured lenses, and fresh flower hair accessories.',
    category: 'Engagement & Reception Makeup',
    price: 10500,
    duration: 120,
    isActive: true,
  },
  {
    _id: '700000000000000000000005',
    name: 'Signature AirBrush Engagement Makeup Package',
    description:
      'Airbrush engagement makeup with a flawless lightweight finish, advanced hairstyling, luxury lashes, hair extensions if needed, outfit draping, premium coloured lenses, and fresh flower hair accessories.',
    category: 'Engagement & Reception Makeup',
    price: 15500,
    duration: 120,
    isActive: true,
  },
  {
    _id: '700000000000000000000006',
    name: 'Temporary Nail Extension (including nail art)',
    description: 'Temporary nail extension with nail art included.',
    category: 'Nail Art',
    price: 1700,
    duration: 45,
    isActive: true,
  },
  {
    _id: '700000000000000000000007',
    name: 'Gel/Acrylic Nail Extensions (including nail art)',
    description: 'Gel or acrylic nail extensions with nail art included.',
    category: 'Nail Art',
    price: 2600,
    duration: 60,
    isActive: true,
  },
  {
    _id: '700000000000000000000008',
    name: 'Shellac(including nail art)',
    description: 'Shellac nails with nail art included.',
    category: 'Nail Art',
    price: 1200,
    duration: 45,
    isActive: true,
  },
  {
    _id: '700000000000000000000009',
    name: 'Classic Party Makeup',
    description: 'Basic party makeup with simple hairstyling.',
    category: 'Party Makeup',
    price: 2500,
    duration: 90,
    isActive: true,
  },
  {
    _id: '700000000000000000000010',
    name: 'HD Party Makeup',
    description: 'HD party makeup with lashes and advanced hairstyling included.',
    category: 'Party Makeup',
    price: 3500,
    duration: 90,
    isActive: true,
  },
  {
    _id: '700000000000000000000011',
    name: 'Signature Party Makeup',
    description:
      'Signature party makeup with lashes, lenses, advanced hairstyling, and international products.',
    category: 'Party Makeup',
    price: 4500,
    duration: 90,
    isActive: true,
  },
  {
    _id: '700000000000000000000012',
    name: 'AirBrush Party Makeup',
    description:
      'Airbrush party makeup with premium lashes, premium lenses, advanced hairstyling, hair accessories, and outfit or dupatta draping.',
    category: 'Party Makeup',
    price: 6500,
    duration: 90,
    isActive: true,
  },
];

export const seedServiceCatalog = serviceCatalog.map(({ _id, ...service }) => service);

export const isLocalServiceCatalogEnabled = () =>
  process.env.LOCAL_SERVICE_CATALOG === 'true' ||
  (process.env.LOCAL_SERVICE_CATALOG !== 'false' &&
    process.env.NODE_ENV !== 'production' &&
    !process.env.RAILWAY_PROJECT_ID &&
    !process.env.RAILWAY_ENVIRONMENT &&
    !process.env.RAILWAY_ENVIRONMENT_NAME &&
    !process.env.VERCEL);

export const getLocalServiceById = (id) =>
  serviceCatalog.find((service) => service._id === String(id));

export const getFilteredLocalServices = ({ search, category } = {}) => {
  const searchText = String(search || '').trim().toLowerCase();

  return serviceCatalog.filter((service) => {
    if (!service.isActive) return false;
    if (category && service.category !== category) return false;
    if (!searchText) return true;

    return [service.name, service.description, service.category]
      .join(' ')
      .toLowerCase()
      .includes(searchText);
  });
};
