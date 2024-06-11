import React, { useState, useEffect } from "react";
import "../src/assets/CSS/alignmentSettings.css";
// import "../src/assets/CSS/fitmentSettings.css"; // Uncomment if fitmentSettings.css is used

type SettingsProps = {
  updateModel: (model: any) => void;
};

const CombinedSettings = ({ updateModel }: SettingsProps) => {
  const [frontCamber, setFrontCamber] = useState(0);
  const [rearCamber, setRearCamber] = useState(0);
  const [frontCaster, setFrontCaster] = useState(0);
  const [frontToe, setFrontToe] = useState(0);
  const [rearToe, setRearToe] = useState(0);

  const [tireWidth, setTireWidth] = useState(0);
  const [tireSidewall, setTireSidewall] = useState(0);
  const [tireRadius, setTireRadius] = useState(0);
  const [wheelWidth, setWheelWidth] = useState(0);
  const [wheelDiameter, setWheelDiameter] = useState(0);
  const [wheelOffset, setWheelOffset] = useState(0);

  useEffect(() => {
    updateModel({
      frontCamber,
      rearCamber,
      frontCaster,
      frontToe,
      rearToe,
      tireWidth,
      tireSidewall,
      tireRadius,
      wheelWidth,
      wheelDiameter,
      wheelOffset,
    });
  }, [
    frontCamber,
    rearCamber,
    frontCaster,
    frontToe,
    rearToe,
    tireWidth,
    tireSidewall,
    tireRadius,
    wheelWidth,
    wheelDiameter,
    wheelOffset,
    updateModel,
  ]);

  return (
    <div id="sliderContainer" style={{ width: "300px" }}>
      <div className="input-group">
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCamber">Front Camber</label>
            <span>{frontCamber}°</span>
          </div>
          <input
            id="frontCamber"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={frontCamber}
            onChange={(e) => setFrontCamber(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearCamber">Rear Camber</label>
            <span>{rearCamber}°</span>
          </div>
          <input
            id="rearCamber"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={rearCamber}
            onChange={(e) => setRearCamber(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontCaster">Front Caster</label>
            <span>{frontCaster}°</span>
          </div>
          <input
            id="frontCaster"
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={frontCaster}
            onChange={(e) => setFrontCaster(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="frontToe">Front Toe</label>
            <span>{frontToe} mm</span>
          </div>
          <input
            id="frontToe"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={frontToe}
            onChange={(e) => setFrontToe(parseFloat(e.target.value))}
          />
        </div>
        <div className="input-item">
          <div className="label-value">
            <label htmlFor="rearToe">Rear Toe</label>
            <span>{rearToe} mm</span>
          </div>
          <input
            id="rearToe"
            type="range"
            min="-10"
            max="10"
            step="0.1"
            value={rearToe}
            onChange={(e) => setRearToe(parseFloat(e.target.value))}
          />
        </div>
      </div>
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

export default CombinedSettings;
