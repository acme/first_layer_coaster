from build123d import *
from ocp_vscode import show

length, width, thickness = 80.0, 60.0, 10.0

with BuildPart() as ex:
    with Locations((-25, 0, 0), (25, 0, 0)):
        Sphere(radius=10)
    Cylinder(10, 50, rotation=(90, 0, 0))
    with Locations((0, -25, 0), (0, 25, 0)):
        Sphere(radius=10)
    Cylinder(10, 50, rotation=(0, 90, 0))
    with Locations((0, 0, 25/4)):
        Box(100, 100, 25/2, mode=Mode.INTERSECT)
show(ex)

ex.part.export_step("teacup.step")