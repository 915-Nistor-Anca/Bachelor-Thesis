# /your_app/management/commands/import_stars.py

import json
from django.core.management.base import BaseCommand
from polaris.models import Star

class Command(BaseCommand):
    help = 'Import stars from JSON file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the JSON file')

    def handle(self, *args, **kwargs):
        file_path = kwargs['file_path']
        with open(file_path, 'r', encoding='utf-8') as f:
            stars_data = json.load(f)
            for star_data in stars_data:
                star = Star.objects.create(
                    proper_name=star_data['proper_name'],
                    designation=star_data['designation'],
                    hip=star_data['hip'],
                    bayer=star_data['bayer'],
                    origin=star_data['origin'],
                    ethnic_cultural_group=star_data.get('ethnic_cultural_group', ''),
                    reference=star_data['reference'],
                    additional_info=star_data.get('additional_info', ''),
                    approval_status=star_data['approval_status'],
                    approval_date=star_data['approval_date']
                )
                self.stdout.write(self.style.SUCCESS(f'Star "{star.proper_name}" imported successfully'))
