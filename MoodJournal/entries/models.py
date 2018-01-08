from django.db import models
from django.db.models import Max
from django.contrib.auth.models import User


class UserDefinedCategory(models.Model):
    DEFAULTS = (
        'Social',
        'Personal',
        'Family',
        'Work',
        'Health',
        'Sleep',
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    category = models.CharField(max_length=50)
    rank = models.PositiveIntegerField()

    def save(self, *args, **kwargs):
        if not self.rank:
            max_rank_lookup = self.user.userdefinedcategory_set.aggregate(Max('rank'))
            max_rank = max_rank_lookup['rank__max']
            if max_rank:
                self.rank = max_rank + 1
            else:
                self.rank = 0
        super(UserDefinedCategory, self).save(*args, **kwargs)

    def __str__(self):
        return self.category


class EntryInstance(models.Model):
    ONE = 'Terrible'
    TWO = 'Bad'
    THREE = 'OK'
    FOUR = 'Good'
    FIVE = 'Excellent'
    QUALITY_RATING_CHOICES = (
        (ONE, 'Terrible'),
        (TWO, 'Bad'),
        (THREE, 'OK'),
        (FOUR, 'Good'),
        (FIVE, 'Excellent'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(UserDefinedCategory, on_delete=models.CASCADE, unique_for_date="date")

    date = models.DateField()
    entry = models.TextField()
    quality_rating = models.CharField(max_length=15, choices=QUALITY_RATING_CHOICES, default=THREE)

    def __str__(self):
        return '{}, {}, {}'.format(self.user, self.date, self.category)
