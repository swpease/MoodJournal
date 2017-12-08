import datetime

from django.shortcuts import render

from rest_framework import generics, mixins, permissions, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance


class EntriesList(generics.ListAPIView):
    serializer_class = EntryInstanceSerializer

    def get_queryset(self):
        return EntryInstance.objects.filter(user=self.request.user)
    #TODO permissions | pagination


class EntriesOnDateList(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        generics.GenericAPIView):
    """
    Provides the set of entries that a User has created on a given date.
    HTTP Methods
        GET     : All `EntryInstance`s of a User on the date specified by the URL pattern.
        POST    : Create a new `EntryInstance` on the given date.
        DELETE  : Delete an `EntryInstance` on the given date.
        PATCH   : Update an `EntryInstance` on the given date.
    """
    serializer_class = EntryInstanceSerializer

    def get_queryset(self):
        # A Django DateField is represented in Python as a datetime.date instance.
        # http://www.django-rest-framework.org/api-guide/filtering/  : "Filtering agaisnt the URL"
        date_str = self.kwargs['date']  # In the format: YYYYMMDD
        date = datetime.date(int(date_str[:4]), int(date_str[4:6]), int(date_str[6:]))

        return EntryInstance.objects.filter(user=self.request.user).filter(date=date)

    def get(self, request, *args, **kwargs):
        entry_instance_queryset = self.filter_queryset(self.get_queryset())
        user_defined_categories_queryset = UserDefinedCategory.objects.filter(user=self.request.user)

        entry_instance_serializer = self.get_serializer(entry_instance_queryset, many=True)
        user_defined_categories_serializer = UserDefinedCategorySerializer(user_defined_categories_queryset, many=True)

        data = {"EntryInstances_on_date": entry_instance_serializer.data,
                "UserDefinedCategories": user_defined_categories_serializer.data}

        return Response(data)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# class CategoriesList(mixins.ListModelMixin,
#                      mixins.CreateModelMixin,
#                      mixins.UpdateModelMixin,
#                      mixins.DestroyModelMixin,
#                      generics.GenericAPIView):
#     """
#     Provides the set of categories that the user has defined (or the defaults) for their entries.
#     HTTP Methods
#         GET     : All `UserDefinedCategory`s of a User.
#         POST    : Create a new `UserDefinedCategory`.
#         DELETE  : Delete a `UserDefinedCategory`.
#         PATCH   : Update a `UserDefinedCategory` using one of two methods:
#                       1. Rename the `UserDefinedCategory`
#                       2. Swap the ordering of two `UserDefinedCategory`s [using pk attrs]
#     """
#     serializer_class = UserDefinedCategorySerializer
#
#     def get_queryset(self):
#         return UserDefinedCategory.objects.filter(user=self.request.user)
#
