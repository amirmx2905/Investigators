# Generated by Django 5.1.7 on 2025-03-27 22:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('investigators', '0006_usuario_estudiante_usuario_investigador'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usuario',
            name='id_estudiante',
        ),
        migrations.RemoveField(
            model_name='usuario',
            name='id_investigador',
        ),
    ]
