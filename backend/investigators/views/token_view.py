from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from investigators.serializers.token_serializer import CustomTokenObtainSerializer

class CustomTokenObtainView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = CustomTokenObtainSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)