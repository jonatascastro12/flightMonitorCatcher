# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('monitor', '0003_flight_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flight',
            name='searchUrl',
            field=models.CharField(max_length=500),
            preserve_default=True,
        ),
    ]
