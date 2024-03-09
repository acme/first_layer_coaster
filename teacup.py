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

# x1, y1, x2, y2 = 0, 0, 25, 25
# r = 10
# with BuildPart() as ex:
#     with BuildLine() as ex_ln:
#         l1 = Line((x1, y1), (x2, y2))
#     with BuildSketch(Plane(origin=l1 @ 0, z_dir=l1 % 0)) as ex_sk:
#         Circle(r)
#     sweep()
#     with Locations((x1, y1, 0), (x2, y2, 0)):
#         Sphere(radius=r)
#     split(bisect_by=Plane.XY)

def create_geometry(x1, y1, z1, x2, y2, z2, r):
    with BuildPart() as ex:
        with BuildLine() as ex_ln:
            l1 = Line((x1, y1, z1), (x2, y2, z2))
        with BuildSketch(Plane(origin=l1 @ 0, z_dir=l1 % 0)) as ex_sk:
            c1 =Circle(r)
        sweep()
        with Locations((x1, y1, z1), (x2, y2, z2)):
            Sphere(radius=r)
        split(bisect_by=Plane.XY)
        return ex

geom_list = []
geom_list.append(create_geometry(0, 0, 0, 25, 0, 0, 10))
geom_list.append(create_geometry(0, 0, 10, 0, 25, 10, 10))
geom_list.append(create_geometry(10, 0, 0, 10, 25, 0, 10))

from functools import reduce
import operator
all = reduce(operator.add, [geom.part for geom in geom_list[0:]])

show(all)
all.export_step("teacup.step")
all.export_stl("teacup.stl")

