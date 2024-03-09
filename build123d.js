const fs = require('fs');

// Read the GCode file
const gcodeFile = 'cube_0.4n_0.2mm_PLA_MK4IS_2m.gcode';
const gcodeContent = fs.readFileSync(gcodeFile, 'utf-8');

// Split the GCode content into lines
const gcodeLines = gcodeContent.split('\n');

// Initialize variables for OpenSCAD conversion
let build123dCode = `
from build123d import *
from ocp_vscode import show

def create_geometry(x1, y1, z1, x2, y2, z2, r):
    with BuildPart() as ex:
        with BuildLine() as ex_ln:
            l1 = Line((x1, y1, z1), (x2, y2, z2))
        with BuildSketch(Plane(origin=l1 @ 0, z_dir=l1 % 0)) as ex_sk:
            Circle(r)
        sweep()
        with Locations((x1, y1, z1), (x2, y2, z2)):
            Sphere(radius=r)
        split(bisect_by=Plane.XY)
    return ex

geom_list = []
`;
let currentPos = { x: 0, y: 0, z: 0 };
let previousPos = { x: 0, y: 0, z: 0 };
const width = 140;
const scale = 16;
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
      if (currentPos.z <= 0.2) {
        build123dCode += `# ${comment}\n`;
      }
    }
    return;
  }

  // Parse GCode commands
  let parts = line.split(' ');
  const command = parts.shift();
  console.log(`* [${command}] [${parts}]`);

  // Only handle G1
  if (command !== 'G1') return;

  console.log(currentPos.x, currentPos.y, currentPos.z);

  if (currentPos.z <= 0.2) {
    build123dCode += `# ${line}\n`;
  }

  parts.forEach(parameter => {
    const code = parameter.charAt(0);
    const value = parseFloat(parameter.slice(1));
    let e = 0;
    // console.log("code", code, "value", value);
    switch (code) {
      case 'X':
        currentPos.x = value;
        break;
      case 'Y':
        currentPos.y = value;
        break;
      case 'Z':
        currentPos.z = value;
        break;
      case 'E':
        e = value;
        break;
    }
    if (e > 0 && currentPos.z <= 0.2) {
      const distance = Math.sqrt((currentPos.x - previousPos.x) ** 2 + (currentPos.y - previousPos.y) ** 2);
      if (distance) {
        build123dCode += `geom_list.append(create_geometry(${previousPos.x * scale}, ${previousPos.y * scale}, ${previousPos.z * scale}, ${currentPos.x * scale}, ${currentPos.y * scale}, ${currentPos.z * scale}, ${width * e / distance}))\n`
      }
    }
  });
  previousPos = { ...currentPos };
});

build123dCode += `
from functools import reduce
import operator
all = reduce(operator.add, [geom.part for geom in geom_list[0:]])

show(all)
all.export_step("teacup.step")
all.export_stl("teacup.stl")
`;

// Write the OpenSCAD code to a file
const openscadFile = 'output.py';
fs.writeFileSync(openscadFile, build123dCode);
console.log(build123dCode);

console.log('OpenSCAD code generated successfully.');