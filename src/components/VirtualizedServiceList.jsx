import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AutoSizer from "react-virtualized-auto-sizer";
import { Grid } from "react-window";
import { getFallbackImage } from "../utils/imageUtils";
import { renderStars } from "../utils/uiUtils.jsx";
import LazyImage from "./LazyImage";

const VirtualizedServiceList = ({ services }) => {
  // State for responsive grid dimensions
  const [dimensions, setDimensions] = useState(() => calculateGridDimensions());

  // Calculate grid dimensions based on screen width
  const calculateGridDimensions = useCallback(() => {
    const width = window.innerWidth;
    let columnCount;

    if (width < 640) {
      columnCount = 1; // Mobile
    } else if (width < 1024) {
      columnCount = 2; // Tablet
    } else {
      columnCount = 3; // Desktop
    }

    // Account for padding and gaps between items
    const itemWidth = Math.floor((width - 48 - columnCount * 24) / columnCount);
    const itemHeight = 420; // Fixed height for service cards

    return {
      columnCount,
      itemWidth,
      itemHeight,
      rowCount: Math.ceil(services.length / columnCount),
      containerWidth: width - 24, // Account for container padding
    };
  }, [services.length]);

  // Handle window resize to update grid dimensions
  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateGridDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateGridDimensions]);

  // Render a service cell
  const Cell = useCallback(
    ({ columnIndex, rowIndex, style }) => {
      const index = rowIndex * dimensions.columnCount + columnIndex;

      if (index >= services.length) {
        // Return empty cell for placeholders at the end of the grid
        return <div style={style}></div>;
      }

      const service = services[index];

      return (
        <div style={style} className="p-3 flex items-start">
          <div className="card hover:shadow-lg transition-all duration-300 backdrop-blur-lg bg-white/70 border border-white/20 w-full h-full flex flex-col">
            {/* Service Image */}
            <div className="mb-4">
              {service.image_url ? (
                <LazyImage
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ) : (
                <LazyImage
                  src={getFallbackImage(service.name)}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Service Info */}
            <div className="space-y-3 px-2 pb-2 flex-grow flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {service.name}
              </h3>

              <p className="text-gray-600 text-sm line-clamp-2">
                {service.short_desc}
              </p>

              {/* Rating */}
              <div className="flex items-center justify-between mt-auto">
                {service.avg_rating > 0 ? (
                  renderStars(service.avg_rating)
                ) : (
                  <span className="text-sm text-gray-500">No ratings yet</span>
                )}
                <span className="text-sm text-gray-500">
                  {service.review_count} review
                  {service.review_count !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-2xl font-bold text-primary-600">
                  ৳{service.price}
                </span>
                <Link
                  to={`/services/${service.id}`}
                  className="btn-primary backdrop-blur-sm text-sm py-1 px-3"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    },
    [dimensions.columnCount, services],
  );

  // Render a row of service cells
  const Row = useCallback(
    ({ rowIndex, style }) => {
      const startIndex = rowIndex * dimensions.columnCount;
      const endIndex = Math.min(
        startIndex + dimensions.columnCount,
        services.length,
      );

      const cells = [];
      for (let i = startIndex; i < endIndex; i++) {
        const columnIndex = i % dimensions.columnCount;
        cells.push(
          <Cell
            key={i}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
            style={{
              position: "absolute",
              left: `${columnIndex * dimensions.itemWidth}px`,
              top: 0,
              width: `${dimensions.itemWidth}px`,
              height: "100%",
            }}
          />,
        );
      }

      return <div style={style}>{cells}</div>;
    },
    [Cell, dimensions, services.length],
  );

  // Early return for empty services (moved after all hooks)
  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg backdrop-blur-sm bg-white/30 rounded-xl p-4 inline-block">
          No services available.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: "calc(100vh - 200px)" }} className="w-full">
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnCount={dimensions.columnCount}
            columnWidth={() => dimensions.itemWidth}
            height={height}
            rowCount={dimensions.rowCount}
            rowHeight={() => dimensions.itemHeight}
            width={width}
          >
            {Row}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedServiceList;
