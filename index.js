// This GCode is a set of instructions for a 3D printer to print a specific layer of an object. Let's break it down:

// 1. `142 S36` sets the target temperature for the heatbreak to 36 degrees.
// 2. `M107` turns off the fan.
// 3. `;LAYER_CHANGE` and `;Z:0.2` indicate a layer change and the new Z height of 0.2 mm.
// 4. `G1 E-.7 F2100` retracts the filament by 0.7 mm at a speed of 2100 mm/min.
// 5. `M486 S0` sets the chamber temperature control off.
// 6. `G1 Z.8 F720` moves the print head to Z height 0.8 mm at a speed of 720 mm/min.
// 7. `G1 X126.593 Y106.593 F18000` moves the print head to coordinates (126.593, 106.593) at a speed of 18000 mm/min.
// 8. `G1 Z.2 F720` lowers the print head back to Z height 0.2 mm.
// 9. `G1 E.7 F2100` extrudes 0.7 mm of filament at a speed of 2100 mm/min.
// 10. `M73` and `M204` are progress and acceleration control commands.
// 11. `;TYPE:Perimeter` and `;WIDTH:0.499999` specify the type of extrusion and the width.
// 12. The following `G1` commands define the perimeter of the layer, moving the print head and extruding filament.
// 13. `;TYPE:External perimeter` specifies the outer perimeter.
// 14. More `G1` commands follow to print the outer perimeter.
// 15. `;TYPE:Solid infill` and `;WIDTH:0.549541` indicate the infill type and width.
// 16. The subsequent `G1` commands fill the interior of the layer.
// 17. Finally, `M486 S-1` and `M106 S127.5` control the chamber temperature and fan speed.

// In summary, this GCode snippet prints a single layer of an object, defining the perimeter and infill, while controlling the print head movement, filament extrusion, temperature, and fan settings.

const fs = require('fs');

// Read the GCode file
const gcodeFile = 'cube_0.4n_0.2mm_PLA_MK4IS_2m.gcode';
const gcodeContent = fs.readFileSync(gcodeFile, 'utf-8');

// Split the GCode content into lines
const gcodeLines = gcodeContent.split('\n');

// Initialize variables for OpenSCAD conversion
let openscadCode = `include <BOSL2/std.scad>\n$fn = $preview ? 64 : 128;\n`;
let currentX = 0;
let currentY = 0;
let currentZ = 0;
let previousX = 0;
let previousY = 0;
let previousZ = 0;
let colour = 'white';

// Parse GCode lines and generate OpenSCAD code
gcodeLines.forEach((line) => {
  // Remove any leading/trailing whitespace
  line = line.trim();

  // Skip empty lines
  if (line === '') {
    return;
  }

  // Copy comments
  if (line.charAt(0) == ';') {
    const comment = line.replace(/^; ?/, '');
    if (comment == 'TYPE:Perimeter') {
      colour = "gold";
    } else if (comment == 'TYPE:External perimeter') {
      colour = "yellow";
    } else if (comment == 'TYPE:Solid infill' || comment == 'TYPE:Internal infill' || comment == 'TYPE:Top solid infill') {
      colour = "red";
    }
    if (comment == "LAYER_CHANGE" || comment.match(/^TYPE:/)) {
      // First layer only
      if (currentZ <= 0.2) {
        openscadCode += `// ${comment}\n`;
      }
    }
    return;
  }

  // Parse GCode commands
  let parts = line.split(' ');
  const command = parts.shift();
  console.log(`* [${command}] [${parts}]`);

  // Only handle G1
  if (command != 'G1') {
    return;
  }

  console.log(currentX, currentY, currentZ);

  if (currentZ <= 0.2) {
    openscadCode += `// ${line}\n`;
  }

  parts.forEach(parameter => {
    const code = parameter.charAt(0);
    const value = parseFloat(parameter.slice(1));
    let e = 0;
    // console.log("code", code, "value", value);
    switch (code) {
      case 'X':
        currentX = value;
        break;
      case 'Y':
        currentY = value;
        break;
      case 'Z':
        currentZ = value;
        break;
      case 'E':
        e = value;
        break;
      // Add more cases for other GCode commands as needed
    }
    if (e > 0 && currentZ <= 0.2) {
      // if (e > 0) {
      openscadCode += `color("${colour}") stroke([[${previousX}, ${previousY}, ${previousZ}], [${currentX}, ${currentY}, ${currentZ}]], width=0.6);\n`;
    }
  });
  previousX = currentX;
  previousY = currentY;
  previousZ = currentZ;
});

// Write the OpenSCAD code to a file
const openscadFile = 'output.scad';
fs.writeFileSync(openscadFile, openscadCode);
console.log(openscadCode);

console.log('OpenSCAD code generated successfully.');