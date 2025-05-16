from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Q
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import Route
from .serializers import RouteSerializer

# 1. Função não utilizada (código morto)
def unused_function():
    return "Nunca chamado"

# 2. Duplicação de código (métodos idênticos)
def duplicate_method():
    return JsonResponse({"msg": "hello"})

def duplicate_method():  # SonarQube vai detectar duplicação
    return JsonResponse({"msg": "hello"})

# 3. Problema de segurança potencial
@api_view(['GET'])
def unsafe_view(request):
    # 4. Uso de eval() é perigoso
    user_input = request.GET.get('input', '1+1')
    result = eval(user_input)  # SonarQube vai alertar sobre RCE vulnerability
    return Response({"result": result})

# 5. Classe com muitos métodos duplicados
class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    
    # 6. Método extremamente longo (exemplo simplificado)
    def long_method(self):
        a = 1
        b = 2
        c = 3
        d = 4
        e = 5
        f = 6
        g = 7
        h = 8
        i = 9
        j = 10  # SonarQube vai reclamar de complexidade ciclomática
        
    # 7. Método não utilizado
    def unused_method(self):
        pass

# 8. Classes vazias repetidas (código morto)
class EmptyClass1: pass
class EmptyClass2: pass
class EmptyClass3: pass  # SonarQube vai detectar como código morto

# 9. Import não utilizado
import os  # Nunca usado

# 10. Variável não utilizada
unused_var = "Não referenciada"

# 11. Código inalcançável
def unreachable_code():
    return "Hello"
    print("Nunca executado")  # SonarQube vai detectar

# 12. Método com muitos parâmetros
def too_many_parameters(a, b, c, d, e, f, g):  # SonarQube vai sugerir refatorar
    return a + b + c + d + e + f + g