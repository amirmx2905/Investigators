from rest_framework import serializers
from investigators.models import NivelSNII

class NivelSNIISerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelSNII
        fields = '__all__'