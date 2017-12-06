from rest_framework import serializers

from .models import UserDefinedCategory
from .models import EntryInstance


class UserDefinedCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserDefinedCategory
        fields = ('user', 'category', 'pk',)


class EntryInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EntryInstance
        fields = ('user', 'category', 'date', 'entry', 'quality_rating', 'pk',)
