from django_filters import rest_framework as filters
from .models import EntryInstance


"""
Filter usage:
/api/entries/?[[fieldname]]={thingtofilterby}[&(etc.)]
I've set entry to default to icontains
"""


class EntriesFilter(filters.FilterSet):
    quality_rating = filters.ChoiceFilter(choices=EntryInstance.QUALITY_RATING_CHOICES,
                                          empty_label='All',
                                          )
    entry = filters.CharFilter(lookup_expr='icontains')
    # https://github.com/philipn/django-rest-framework-filters/issues/125
    date_start = filters.DateFilter(name='date', lookup_expr='gte')
    date_end = filters.DateFilter(name='date', lookup_expr='lte')
    date = filters.DateFilter()
    category = filters.CharFilter(name='category__category', lookup_expr='iexact')

    class Meta:
        model = EntryInstance
        fields = ['quality_rating', 'entry', 'date', 'category']

