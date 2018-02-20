from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.permissions import IsAuthenticated
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
