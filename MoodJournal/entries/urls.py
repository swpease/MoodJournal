from django.conf.urls import url

from . import views


urlpatterns = [
    url('^entries/$', views.EntriesList.as_view(), name='entries-list'),
    url('^entries/(?P<date>[0-9]{8})/$', views.EntriesOnDateList.as_view(), name='entries-on-date'),
    url('^entries/(?P<date>[0-9]{8})/(?P<category>[^/\n]+)/$', views.EntriesDetail.as_view(), name='entry-detail'),
    url('^categories/$', views.CategoriesList.as_view(), name='categories-list'),
]
