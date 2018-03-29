from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from django_filters import rest_framework as filters


from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance
from .filters import EntriesFilter


@api_view(['GET'])
def api_root(request):
    return Response({
        'entries': reverse('entries-list', request=request),
        'categories': reverse('categories-list', request=request),
        'quality_ratings': reverse('quality-ratings-list', request=request),
        'entry_filter_options': reverse('entry-filter-options-list', request=request),
    })


@api_view(['GET'])
def quality_ratings(request):
    quality_ratings = [qr[0] for qr in EntryInstance.QUALITY_RATING_CHOICES]
    return Response(quality_ratings)


#TODO: this view is brittle.
@api_view(['GET'])
def entry_filter_options(request):
    FILTER_OPTIONS = {
        'quality_rating': 'exact',
        'entry': 'icontains',
        'category': 'iexact',
        'date': 'exact',
        'date_start': 'gte',
        'date_end': 'lte'
    }
    return Response(FILTER_OPTIONS)


class EntriesList(generics.ListCreateAPIView):
    """
    Provides all entries a User has ever created, or a filtered subset thereof.
    HTTP Methods
        GET             : List all `EntryInstance`s a User has created.
        GET+querystring : List a subset of `EntryInstance`s a User has created.
        POST            : Create a new EntryInstance.
    """
    serializer_class = EntryInstanceSerializer
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = EntriesFilter
    pagination_class = LimitOffsetPagination

    throttle_scope = None

    def get_queryset(self):
        return EntryInstance.objects.filter(user=self.request.user)

    # TODO permissions | pagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_throttles(self):
        # http://www.pedaldrivenprogramming.com/2017/05/throttling-django-rest-framwork-viewsets/
        if self.request.method == 'POST':
            self.throttle_scope = 'Entries.POST'
        else:
            self.throttle_scope = None

        return super().get_throttles()


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
