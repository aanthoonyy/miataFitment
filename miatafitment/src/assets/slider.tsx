import React, { useState } from 'react';

function Slider() {
    const [value, setValue] = useState(0);

    const handleChange = (event: any) => {
        setValue(event.target.value);
        // Update the cube's y-axis position here
        // cube.position.y = event.target.value;
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