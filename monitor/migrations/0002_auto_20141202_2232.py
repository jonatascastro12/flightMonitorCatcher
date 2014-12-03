# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='flight',
            old_name='dataIda',
            new_name='departDate',
        ),
        migrations.RenameField(
            model_name='flight',
            old_name='dataVolta',
            new_name='returnDate',
        ),
        migrations.RenameField(
            model_name='flight',
            old_name='search_url',
            new_name='searchUrl',
        ),
    ]
