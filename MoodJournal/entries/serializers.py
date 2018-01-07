from rest_framework import serializers

from .models import UserDefinedCategory
from .models import EntryInstance


class UserDefinedCategorySerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='category-detail')
    # user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserDefinedCategory
        fields = ('url', 'category', 'rank')
        # TODO pk can be removed when transition completed.
        # TODO should I just omit the user?


class EntryInstanceSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='entry-detail')
    # TODO do I want this or just a HyperlinkedIdentityField or just a ReadOnlyField?
    category = UserDefinedCategorySerializer(read_only=True)
    # user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = EntryInstance
        fields = ('url', 'category', 'date', 'entry', 'quality_rating')
