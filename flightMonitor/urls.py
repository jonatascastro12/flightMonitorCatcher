from django.conf.urls import patterns, include, url
from django.contrib import admin
from monitor import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'flightMonitor.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^flights/$', views.FlightList.as_view()),
    url(r'^flights/(?P<pk>[0-9]+)/$', views.FlightDetail.as_view()),

)
