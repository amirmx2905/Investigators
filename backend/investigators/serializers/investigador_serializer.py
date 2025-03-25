from rest_framework import serializers
from investigators.models import Investigador

class InvestigadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investigador
        fields = '__all__'