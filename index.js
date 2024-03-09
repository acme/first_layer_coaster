const fs = require('fs');

// Read the GCode file
const gcodeFile = 'cube_0.4n_0.2mm_PLA_MK4IS_2m.gcode';
const gcodeContent = fs.readFileSync(gcodeFile, 'utf-8');

// Split the GCode content into lines
const gcodeLines = gcodeContent.split('\n');

// Initialize variables for OpenSCAD conversion
let openscadCode = `
include <BOSL2/std.scad>
$fn = $preview ? 64 : 128;
intersection(){
union() {
`;
let currentX = 0;
let currentY = 0;
let currentZ = 0;
let previousX = 0;
let previousY = 0;
let previousZ = 0;
let width = 300;
let scale = 16;
let colour = 'white';

// Parse GCode lines and generate OpenSCAD code
gcodeLines.forEach((line) => {
  line = line.trim();

  if (line === '') return;

  if (line.charAt(0) == ';') {
    const comment = line.replace(/^; ?/, '');
    switch (comment) {
      case 'TYPE:Perimeter':
        colour = "gold";
        break;
      case 'TYPE:External perimeter':
        colour = "yellow";
        break;
      case 'TYPE:Solid infill':
      case 'TYPE:Internal infill':
      case 'TYPE:Top solid infill':
        colour = "red";
        break;
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
    }
    if (e > 0 && currentZ <= 0.2) {
      const distance = Math.sqrt((currentX - previousX) ** 2 + (currentY - previousY) ** 2);
      if (distance) {
        openscadCode += `color("${colour}") stroke([[${previousX * scale}, ${previousY * scale}, ${previousZ * scale}], [${currentX * scale}, ${currentY * scale}, ${currentZ * scale}]], width=${width * e / distance});\n`;
      }
    }
  });
  previousX = currentX;
  previousY = currentY;
  previousZ = currentZ;
});

openscadCode += `
}
translate([0, 0, 0.02 * ${scale}]) cube(10000);
}
`;

// Write the OpenSCAD code to a file
const openscadFile = 'output.scad';
fs.writeFileSync(openscadFile, openscadCode);
console.log(openscadCode);

console.log('OpenSCAD code generated successfully.');