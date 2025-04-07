from django.test import TestCase
from core.models import Route, PointOfInterest

class RouteTestCase(TestCase):
    def setUp(self):
        self.route = Route.create_route("A", "B", 100.0)

    def test_create_route_successfully(self):
        self.assertEqual(self.route.start_point, "A")
        self.assertEqual(self.route.end_point, "B")
        self.assertEqual(self.route.distance, 100.0)
        self.assertEqual(Route.objects.count(), 1)

    def test_estimated_time_with_valid_speed(self):
        route = Route.create_route("C", "D", 120.0)
        tempo = route.estimated_time(60.0)
        self.assertEqual(tempo, 2.0)

    def test_estimated_time_with_zero_speed_raises_error(self):
        with self.assertRaisesMessage(ValueError, "greater than zero"):
            self.route.estimated_time(0)

    def test_list_routes_returns_all_routes(self):
        Route.objects.create(start_point="C", end_point="D", distance=50)
        routes = Route.list_routes()

        self.assertEqual(len(routes), 2)

        expected_routes = [
            ("A", "B", 100.0),
            ("C", "D", 50.0),
        ]
        for route, (start, end, dist) in zip(routes, expected_routes):
            with self.subTest(route=route):
                self.assertEqual(route.start_point, start)
                self.assertEqual(route.end_point, end)
                self.assertEqual(route.distance, dist)

    # def test_route_str_representation_with_pois(self):
    #     poi1 = PointOfInterest.objects.create(type="Waterfall", description="Beautiful waterfall")
    #     poi2 = PointOfInterest.objects.create(type="Lookout", description="Scenic view")

    #     RoutePointOfInterest.objects.create(route=self.route, point_of_interest=poi1, distance=25)
    #     RoutePointOfInterest.objects.create(route=self.route, point_of_interest=poi2, distance=75)

    #     expected = "Route from A to B (100.0 km) | Points of Interest: Waterfall (25.0 km); Lookout (75.0 km)"
    #     self.assertEqual(str(self.route), expected)


# class PointOfInterestTestCase(TestCase):
#     def test_create_point_of_interest_successfully(self):
#         poi = PointOfInterest.objects.create(type="Restaurant", description="Good Food!")
#         self.assertEqual(poi.type, "Restaurant")
#         self.assertEqual(PointOfInterest.objects.count(), 1)


# class RoutePointOfInterestTestCase(TestCase):
#     def setUp(self):
#         self.route = Route.create_route("X", "Y", 200.0)
#         self.poi = PointOfInterest.objects.create(type="Park", description="Nice view")

#     def test_association_between_route_and_poi(self):
#         relation = RoutePointOfInterest.objects.create(
#             route=self.route, point_of_interest=self.poi, distance=50.0
#         )

#         self.assertEqual(self.route.point_of_interest.count(), 1)
#         self.assertEqual(relation.distance, 50.0)
