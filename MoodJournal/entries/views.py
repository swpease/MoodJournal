import datetime

from django.shortcuts import render

from rest_framework import generics, mixins, permissions, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance


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

    def get_queryset(self):
        return UserDefinedCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    #TODO... safeguard against duplicates and "/"


class CategoriesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = UserDefinedCategorySerializer
    # lookup_url_kwarg = 'pk'

    def get_queryset(self):
        return UserDefinedCategory.objects.filter(user=self.request.user)
