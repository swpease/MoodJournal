from django.shortcuts import render

from rest_framework import generics, permissions, renderers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

from .serializers import UserDefinedCategorySerializer, EntryInstanceSerializer
from .models import UserDefinedCategory, EntryInstance


class Entries(generics.ListAPIView):
    serializer_class = EntryInstanceSerializer

    def get_queryset(self):
        return Entries.objects.filter(user=self.request.user)


