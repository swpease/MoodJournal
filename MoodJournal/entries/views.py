import datetime

from django.shortcuts import render

from rest_framework import generics, mixins, permissions, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance


class EntriesList(generics.ListAPIView):
    """
    Provides all entries a User has ever created.
    HTTP Methods
        GET      : List all `EntryInstance`s a User has created.
    """
    serializer_class = EntryInstanceSerializer

    def get_queryset(self):
        default_queryset = EntryInstance.objects.filter(user=self.request.user)
        filtered_queryset = default_queryset

        category = self.request.query_params.get('category', None)
        if category is not None:
            filtered_queryset = default_queryset.filter(category__category__iexact=category)

        return default_queryset
    #TODO permissions | pagination | filtering

    #TODO: maybe make my own mixin b/c I think the get() will be the same for this and EODL.
    # def get(self, request, *args, **kwargs):



class EntriesOnDateList(generics.ListCreateAPIView):
    """
    Provides the set of entries that a User has created on a given date.
    HTTP Methods
        GET     : 1. All `EntryInstance`s of a User on the date specified by the URL pattern.
                  2. All `UserDefinedCategory`s of a User
                  Intended use: Take the `UDC`s to create widgets, and populate with any preexisting `EI`s.
        POST    : Create a new `EntryInstance` on the given date.
    """
    serializer_class = EntryInstanceSerializer

    def get_queryset(self):
        # A Django DateField is represented in Python as a datetime.date instance.
        # http://www.django-rest-framework.org/api-guide/filtering/  : "Filtering agaisnt the URL"
        date_str = self.kwargs['date']  # In the format: YYYYMMDD
        date = datetime.date(int(date_str[:4]), int(date_str[4:6]), int(date_str[6:]))

        return EntryInstance.objects.filter(user=self.request.user).filter(date=date)

    def get(self, request, *args, **kwargs):
        # Taken from ListModelMixin.list method.
        entry_instance_queryset = self.filter_queryset(self.get_queryset())
        user_defined_categories_queryset = UserDefinedCategory.objects.filter(user=self.request.user)

        entry_instance_serializer = self.get_serializer(entry_instance_queryset, many=True)
        user_defined_categories_serializer = UserDefinedCategorySerializer(user_defined_categories_queryset, many=True)

        data = {"EntryInstances_on_date": entry_instance_serializer.data,
                "UserDefinedCategories": user_defined_categories_serializer.data}

        return Response(data)
    #TODO pagination?

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EntriesDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EntryInstanceSerializer
    lookup_field = "category__category"
    lookup_url_kwarg = "category"

    def get_queryset(self):
        date_str = self.kwargs['date']
        date = datetime.date(int(date_str[:4]), int(date_str[4:6]), int(date_str[6:]))

        return EntryInstance.objects.filter(user=self.request.user).filter(date=date)


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
