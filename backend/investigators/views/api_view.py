from rest_framework.decorators import api_view
from rest_framework.response import Response
from investigators.models import Investigador, Usuario, Proyecto
from investigators.serializers import InvestigadorSerializer, UsuarioSerializer, ProyectoSerializer

@api_view(['GET'])
def investigadores_list(request):
    investigadores = Investigador.objects.all()
    serializer = InvestigadorSerializer(investigadores, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def usuarios_list(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def proyectos_list(request):
    proyectos = Proyecto.objects.all()
    serializer = ProyectoSerializer(proyectos, many=True)
    return Response(serializer.data)