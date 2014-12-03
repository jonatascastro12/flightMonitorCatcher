# -*- coding: utf-8 -*-
from rest_framework import serializers
from monitor.models import Flight

class FlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flight
        fields = ('departDate','returnDate','origin','destination', 'price', 'searchUrl','timestamp')