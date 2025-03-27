from rest_framework import serializers
from investigators.models import SNII

class SNIISerializer(serializers.ModelSerializer):
    class Meta:
        model = SNII
        fields = '__all__'