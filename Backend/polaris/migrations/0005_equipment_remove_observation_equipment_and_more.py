# Generated by Django 4.2.11 on 2024-05-02 10:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('polaris', '0004_alter_observation_personal_observations'),
    ]

    operations = [
        migrations.CreateModel(
            name='Equipment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.RemoveField(
            model_name='observation',
            name='equipment',
        ),
        migrations.AddField(
            model_name='observation',
            name='equipment',
            field=models.ManyToManyField(to='polaris.equipment'),
        ),
    ]
