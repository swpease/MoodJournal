from django.conf.urls import url

from . import views


urlpatterns = [
    url('^entries/$', views.EntriesList.as_view(), name='entries-list'),
    url('^entries/(?P<date>[0-9]{8})/$', views.EntriesOnDateList.as_view(), name='entries-on-date'),
]
