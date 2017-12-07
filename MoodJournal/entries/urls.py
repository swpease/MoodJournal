from django.conf.urls import url

from . import views


urlpatterns = [
    url('^entries/$', views.EntriesList.as_view(), name='entries-list'),

]
