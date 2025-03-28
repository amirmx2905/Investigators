from rest_framework import serializers
from investigators.models import JefeArea

class JefeAreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = JefeArea
        fields = '__all__'