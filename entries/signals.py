from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import UserDefinedCategory


#ref: https://simpleisbetterthancomplex.com/tutorial/2016/07/28/how-to-create-django-signals.html
#ref: https://docs.djangoproject.com/en/1.11/topics/signals/
@receiver(post_save, sender=User, weak=False)  # Do I want weak=False?
def create_default_user_defined_categories(sender, instance, created, **kwargs):
    if created:
        for category in UserDefinedCategory.DEFAULTS:
            UserDefinedCategory.objects.create(user=instance, category=category)