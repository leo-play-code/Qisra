# Generated by Django 3.2.13 on 2022-06-29 01:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='createproject',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='createproject',
            name='stop_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
