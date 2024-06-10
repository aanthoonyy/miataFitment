import React, { useState, useEffect } from "react";

type CarSettingsProps = {
  updateModel: (model: any) => void;
};

const CarSettings = ({ updateModel }: CarSettingsProps) => {
  const [tireWidth, setTireWidth] = useState(0);
  const [tireSidewall, setTireSidewall] = useState(0);
  const [tireRadius, setTireRadius] = useState(0);
  const [wheelWidth, setWheelWidth] = useState(0);
  const [wheelDiameter, setWheelDiameter] = useState(0);
  const [wheelOffset, setWheelOffset] = useState(0);

  useEffect(() => {
    updateModel({
      tireWidth,
      tireSidewall,
      tireRadius,
      wheelWidth,
      wheelDiameter,
      wheelOffset,
    });
  }, [
    tireWidth,
    tireSidewall,
    tireRadius,
    wheelWidth,
    wheelDiameter,
    wheelOffset,
    updateModel,
  ]);

  return (
    <div id="sliderContainer">
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="tireWidth">Tire Width</label>
          <input
            id="tireWidth"
            type="number"
            min="0"
            placeholder="Width (mm)"
            value={tireWidth}
            onChange={(e) => setTireWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="tireSidewall">Tire Sidewall</label>
          <input
            id="tireSidewall"
            type="number"
            min="0"
            placeholder="Sidewall (%)"
            value={tireSidewall}
            onChange={(e) => setTireSidewall(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="tireRadius">Tire Radius</label>
          <input
            id="tireRadius"
            type="number"
            min="0"
            placeholder="Radius (in)"
            value={tireRadius}
            onChange={(e) => setTireRadius(parseFloat(e.target.value))}
          />
        </div>
      </div>
      <div className="input-group">
        <div className="input-item">
          <label htmlFor="wheelWidth">Wheel Width</label>
          <input
            id="wheelWidth"
            type="number"
            min="0"
            placeholder="Width (in)"
            value={wheelWidth}
            onChange={(e) => setWheelWidth(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelDiameter">Wheel Diameter</label>
          <input
            id="wheelDiameter"
            type="number"
            min="0"
            placeholder="Diameter (in)"
            value={wheelDiameter}
            onChange={(e) => setWheelDiameter(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <label htmlFor="wheelOffset">Wheel Offset</label>
          <input
            id="wheelOffset"
            type="number"
            min="0"
            placeholder="Offset (mm)"
            value={wheelOffset}
            onChange={(e) => setWheelOffset(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default CarSettings;
