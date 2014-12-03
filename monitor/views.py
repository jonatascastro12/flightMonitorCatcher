from django.shortcuts import render
from monitor.models import Flight
from monitor.serializers import FlightSerializer
from rest_framework import generics

# Create your views here.
class FlightList(generics.ListCreateAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer


class FlightDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer