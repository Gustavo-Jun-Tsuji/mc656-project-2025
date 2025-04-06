import pytest
from core.models import Route, PointOfInterest, RoutePointOfInterest

@pytest.mark.django_db
def test_create_route():
    route = Route.create_route("A", "B", 100.0)
    assert route.start_point == "A"
    assert route.end_point == "B"
    assert route.distance == 100.0
    assert Route.objects.count() == 1

@pytest.mark.django_db
def test_estimated_time():
    route = Route.create_route("A", "B", 120.0)
    tempo = route.estimated_time(60.0)
    assert tempo == 2.0

@pytest.mark.django_db
def test_estimated_time_error():
    route = Route.create_route("A", "B", 100.0)
    with pytest.raises(ValueError, match="greater than zero"):
        route.estimated_time(0)

@pytest.mark.django_db
def test_create_point_of_interest():
    poi = PointOfInterest.objects.create(type="Restaurant", description="Good Food!")
    assert poi.type == "Restaurant"
    assert PointOfInterest.objects.count() == 1

@pytest.mark.django_db
def test_associate_route_and_point_of_interest():
    route = Route.create_route("X", "Y", 200.0)
    poi = PointOfInterest.objects.create(type="Park", description="Nice view")
    
    RoutePointOfInterest.objects.create(route=route, point_of_interest=poi, distance=50.0)

    assert route.point_of_interest.count() == 1
    relacao = RoutePointOfInterest.objects.get(route=route, point_of_interest=poi)
    assert relacao.distance == 50.0

@pytest.mark.django_db
def test_list_routes():
    Route.objects.create(start_point="A", end_point="B", distance=100)
    Route.objects.create(start_point="C", end_point="D", distance=50)

    routes = Route.list_routes()
    assert len(routes) == 2
    assert routes[0].start_point == "A"
    assert routes[0].end_point == "B"
    assert routes[0].distance == 100
    assert routes[1].start_point == "C"
    assert routes[1].end_point == "D"
    assert routes[1].distance == 50

@pytest.mark.django_db
def test_route_str():
    route = Route.objects.create(start_point="A", end_point="B", distance=100)

    poi1 = PointOfInterest.objects.create(type="Waterfall", description="Beautiful waterfall")
    poi2 = PointOfInterest.objects.create(type="Lookout", description="Scenic view")

    RoutePointOfInterest.objects.create(route=route, point_of_interest=poi1, distance=25)
    RoutePointOfInterest.objects.create(route=route, point_of_interest=poi2, distance=75)

    expected_str = "Route from A to B (100 km) | Points of Interest: Waterfall (25.0 km); Lookout (75.0 km)"
    assert str(route) == expected_str