from django.contrib import admin
from monitor.models import Flight, FlightAdmin
# Register your models here.

admin.site.register(Flight,FlightAdmin)
