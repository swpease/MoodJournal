from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from .models import UserDefinedCategory
from .models import EntryInstance


class UserDefinedCategorySerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='category-detail')
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    rank = serializers.IntegerField(max_value=2147483647, min_value=0, required=False)

    class Meta:
        model = UserDefinedCategory
        validators = [
            UniqueTogetherValidator(
                queryset=UserDefinedCategory.objects.all(),
                fields=('user', 'category'),
                message='There is already a category with this name.'
            )
        ]
        fields = ('url', 'category', 'rank', 'user')


class EntryInstanceSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='entry-detail')
    # I was getting weird behavior using other serializer fields, so here we are:
    category = serializers.PrimaryKeyRelatedField(queryset=UserDefinedCategory.objects.all())

    class Meta:
        model = EntryInstance
        fields = ('url', 'category', 'date', 'entry', 'quality_rating')
