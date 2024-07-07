import { useState } from "react";

function Slider() {
  const [value, setValue] = useState(0);

  const handleChange = (event: any) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <input
        type="range"
        min="-10"
        max="10"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default Slider;
