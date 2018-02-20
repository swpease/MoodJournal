from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters

from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance


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


@api_view(['GET'])
def api_root(request):
    return Response({
        'entries': reverse('entries-list', request=request),
        'categories': reverse('categories-list', request=request),
    })


class EntriesList(generics.ListCreateAPIView):
    """
    Provides all entries a User has ever created, and all of their categories.
    HTTP Methods
        GET      : List all `EntryInstance`s a User has created.
    """
    serializer_class = EntryInstanceSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = EntriesFilter

    def get_queryset(self):
        return EntryInstance.objects.filter(user=self.request.user)

    def get(self, request, *args, **kwargs):
        entry_instance_queryset = self.filter_queryset(self.get_queryset())
        user_defined_categories_queryset = UserDefinedCategory.objects.filter(user=self.request.user)

        entry_instance_serializer = self.get_serializer(entry_instance_queryset,
                                                        context={'request': request},
                                                        many=True)
        user_defined_categories_serializer = UserDefinedCategorySerializer(user_defined_categories_queryset,
                                                                           context={'request': request},
                                                                           many=True)

        data = {"EntryInstances": entry_instance_serializer.data,
                "UserDefinedCategories": user_defined_categories_serializer.data}

        return Response(data)
    # TODO permissions | pagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EntriesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EntryInstanceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return EntryInstance.objects.filter(user=self.request.user)


class CategoriesList(generics.ListCreateAPIView):
    """
    Provides the set of categories that the user has defined (or the defaults) for their entries.
    HTTP Methods
        GET     : All `UserDefinedCategory`s of a User.
        POST    : Create a new `UserDefinedCategory` specific to the User.
    """
    serializer_class = UserDefinedCategorySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return UserDefinedCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoriesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserDefinedCategorySerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return UserDefinedCategory.objects.filter(user=self.request.user)
