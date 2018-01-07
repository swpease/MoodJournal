from django.contrib.auth.models import User

from rest_framework import serializers

from .models import UserDefinedCategory
from .models import EntryInstance


class UserDefinedCategorySerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(
        view_name='category-detail'
    )
    # TODO Should I just either not include it, or go with the user name?
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = UserDefinedCategory
        fields = ('url', 'user', 'category', 'pk',)


class EntryInstanceSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = EntryInstance
        fields = ('user', 'category', 'date', 'entry', 'quality_rating', 'pk',)
