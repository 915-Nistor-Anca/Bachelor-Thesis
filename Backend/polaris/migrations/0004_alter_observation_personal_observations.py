# Generated by Django 4.2.11 on 2024-05-01 21:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polaris', '0003_observation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='observation',
            name='personal_observations',
            field=models.CharField(max_length=100),
        ),
    ]
