from build123d import *
from ocp_vscode import show

# length, width, thickness = 80.0, 60.0, 10.0

# with BuildPart() as ex:
#     with Locations((-25, 0, 0), (25, 0, 0)):
#         Sphere(radius=10)
#     Cylinder(10, 50, rotation=(90, 0, 0))
#     with Locations((0, -25, 0), (0, 25, 0)):
#         Sphere(radius=10)
#     Cylinder(10, 50, rotation=(0, 90, 0))
#     split(bisect_by=Plane.XY)

x1, y1, x2, y2 = 0, 0, 25, 25

with BuildPart() as ex:
    with BuildLine() as ex_ln:
        l1 = Line((x1, y1), (x2, y2))
    with BuildSketch(Plane(origin=l1 @ 0, z_dir=l1 % 0)) as ex_sk:
        Circle(10)
    sweep()
    with Locations((x1, y1, 0), (x2, y2, 0)):
        Sphere(radius=10)
    split(bisect_by=Plane.XY)

show(ex)
# ex.part.export_step("teacup.step")
# ex.part.export_step("teacup.stl")
