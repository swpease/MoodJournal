from django.conf.urls import url

from . import views


urlpatterns = [
    url('^$', views.api_root),
    url('^entries/$', views.EntriesList.as_view(), name='entries-list'),
    url('^entries/(?P<pk>[0-9]+)/$', views.EntriesDetail.as_view(), name='entry-detail'),
    url('^categories/$', views.CategoriesList.as_view(), name='categories-list'),
    url('^categories/(?P<pk>[0-9]+)/$', views.CategoriesDetail.as_view(), name='category-detail'),
    url('^quality-ratings/$', views.quality_ratings, name='quality-ratings-list'),
    url('^entry-filter-options/$', views.entry_filter_options, name='entry-filter-options-list'),
]
