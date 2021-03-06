# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-29 22:41
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='EntryInstance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('entry', models.TextField()),
                ('quality_rating', models.CharField(choices=[('Terrible', 'Terrible'), ('Bad', 'Bad'), ('OK', 'OK'), ('Good', 'Good'), ('Excellent', 'Excellent')], default='OK', max_length=15)),
            ],
        ),
        migrations.CreateModel(
            name='UserDefinedCategory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(max_length=50)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='entryinstance',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='entries.UserDefinedCategory', unique_for_date='date'),
        ),
        migrations.AddField(
            model_name='entryinstance',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
