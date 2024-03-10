
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
# TYPE:Custom
# G1 X42 Y-4 Z5 F4800
# G1 E.7 F2100
# TYPE:Perimeter
# G1 F900
# G1 X123.407 Y106.593 E.12109
geom_list.append(create_geometry(2025.488, 1705.488, 3.2, 1974.512, 1705.488, 3.2, 5.320966729441294))
# G1 X123.407 Y103.407 E.12109
geom_list.append(create_geometry(1974.512, 1705.488, 3.2, 1974.512, 1654.512, 3.2, 5.320966729441294))
# G1 X126.593 Y103.407 E.12109
geom_list.append(create_geometry(1974.512, 1654.512, 3.2, 2025.488, 1654.512, 3.2, 5.320966729441294))
# G1 X126.593 Y105 E.06054
geom_list.append(create_geometry(2025.488, 1654.512, 3.2, 2025.488, 1680, 3.2, 5.320527306967973))
# G1 X126.593 Y106.533 E.05826
geom_list.append(create_geometry(2025.488, 1680, 3.2, 2025.488, 1704.528, 3.2, 5.320547945205475))
# G1 X127.05 Y107.05 F18000
# TYPE:External perimeter
# G1 F900
# G1 X122.95 Y107.05 E.15583
geom_list.append(create_geometry(2032.8, 1712.8, 3.2, 1967.2, 1712.8, 3.2, 5.32102439024391))
# G1 X122.95 Y102.95 E.15583
geom_list.append(create_geometry(1967.2, 1712.8, 3.2, 1967.2, 1647.2, 3.2, 5.32102439024391))
# G1 X127.05 Y102.95 E.15583
geom_list.append(create_geometry(1967.2, 1647.2, 3.2, 2032.8, 1647.2, 3.2, 5.32102439024391))
# G1 X127.05 Y105 E.07791
geom_list.append(create_geometry(2032.8, 1647.2, 3.2, 2032.8, 1680, 3.2, 5.320682926829275))
# G1 X127.05 Y106.99 E.07563
geom_list.append(create_geometry(2032.8, 1680, 3.2, 2032.8, 1711.84, 3.2, 5.320703517587954))
# G1 X126.654 Y107.049 F18000
# G1 E-.7 F2100
# G1 X125.381 Y103.59 Z.264 F18000
# G1 E.7 F2100
# TYPE:Solid infill
# G1 F900
# G1 X126.204 Y104.413 E.04903
geom_list.append(create_geometry(2006.096, 1657.44, 3.2, 2019.264, 1670.608, 3.2, 5.897597044253631))
# G1 X126.204 Y105.13 E.0302
geom_list.append(create_geometry(2019.264, 1670.608, 3.2, 2019.264, 1682.08, 3.2, 5.896792189679229))
# G1 X124.87 Y103.796 E.07947
geom_list.append(create_geometry(2019.264, 1682.08, 3.2, 1997.92, 1660.736, 3.2, 5.897397770708663))
# G1 X124.154 Y103.796 E.03016
geom_list.append(create_geometry(1997.92, 1660.736, 3.2, 1986.464, 1660.736, 3.2, 5.8972067039105465))
# G1 X126.204 Y105.846 E.12213
geom_list.append(create_geometry(1986.464, 1660.736, 3.2, 2019.264, 1693.536, 3.2, 5.897684471260412))
# G1 X126.204 Y106.204 E.01508
geom_list.append(create_geometry(2019.264, 1693.536, 3.2, 2019.264, 1699.264, 3.2, 5.89720670391078))
# G1 X125.846 Y106.204 E.01508
geom_list.append(create_geometry(2019.264, 1699.264, 3.2, 2013.536, 1699.264, 3.2, 5.89720670391078))
# G1 X123.796 Y104.154 E.12213
geom_list.append(create_geometry(2013.536, 1699.264, 3.2, 1980.736, 1666.464, 3.2, 5.897684471260412))
# G1 X123.796 Y104.87 E.03016
geom_list.append(create_geometry(1980.736, 1666.464, 3.2, 1980.736, 1677.92, 3.2, 5.8972067039105465))
# G1 X125.13 Y106.204 E.07947
geom_list.append(create_geometry(1980.736, 1677.92, 3.2, 2002.08, 1699.264, 3.2, 5.897397770708663))
# G1 X124.413 Y106.204 E.0302
geom_list.append(create_geometry(2002.08, 1699.264, 3.2, 1990.608, 1699.264, 3.2, 5.896792189679229))
# G1 X123.59 Y105.381 E.04903
geom_list.append(create_geometry(1990.608, 1699.264, 3.2, 1977.44, 1686.096, 3.2, 5.897597044253631))
# LAYER_CHANGE
# G1 E-.7 F2100
# G1 X123.59 Y105.381 Z.2 F18000
# G1 X126.868 Y106.868 Z.4 F13159.599

from functools import reduce
import operator
all = reduce(operator.add, [geom.part for geom in geom_list[0:]])

show(all)
all.export_step("output.step")
all.export_stl("output.stl")
