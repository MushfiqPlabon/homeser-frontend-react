export const getFallbackImage = (serviceName) => {
  const serviceImages = {
    "House Cleaning": "/images/service_cleaning.png",
    "House Deep Cleaning": "/images/service_cleaning.png",
    "Bathroom Cleaning": "/images/service_cleaning.png",
    "Pipe Repair": "/images/service_plumbing.png",
    "Toilet Installation": "/images/service_plumbing.png",
    "Wiring Repair": "/images/service_electrical.png",
    "Garden Maintenance": "/images/service_plumbing.png",
    "Wall Painting": "/images/service_cleaning.png",
  };

  return serviceImages[serviceName] || "/images/service_cleaning.png";
};
