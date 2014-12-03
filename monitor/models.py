from django.db import models
from django.contrib import admin

# Create your models here.
class Flight(models.Model):
	departDate = models.DateField()
	returnDate = models.DateField()
	origin = models.CharField(max_length=150)
	destination = models.CharField(max_length=150)
	searchUrl = models.CharField(max_length=500)
	price = models.DecimalField(max_digits=6, decimal_places=2)
	timestamp =  models.DateTimeField(auto_now_add=True, blank=True)

class FlightAdmin(admin.ModelAdmin):
	list_display = ('departDate','returnDate','destination','price')
