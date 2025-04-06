from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from typing import List
import math

class PontoDeInteresse(models.Model):
    nome = models.CharField(max_length=200)
    # TODO: substituir tipo (CharField) por relacionamento com outra classe
    tipo = models.CharField(max_length=100, help_text="Forma/função concreta do ponto (ex: restaurante, parque, etc)") 
    categoria = models.CharField(max_length=100, blank=True, help_text="Tema onde se encaixa (ex: lazer, cultura, etc)")
    endereco = models.CharField(max_length=255)
    latitude = models.FloatField(validators=[MinValueValidator(-90), MaxValueValidator(90)])
    longitude = models.FloatField(validators=[MinValueValidator(-180), MaxValueValidator(180)])
    descricao = models.TextField(blank=True)
    adicionado_em = models.DateTimeField(auto_now_add=True)
    ultima_modificacao = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.nome} ({self.tipo})"

    def exibir_descricao(self) -> None:
        print(f"Descrição: {self.descricao}")

    def adicionar_feedback(self, autor: str, comentario: str, nota: int) -> None:
        Feedback.objects.create(ponto=self, autor=autor, comentario=comentario, nota=nota)

    def feedbacks(self) -> List["Feedback"]:
        return list(self.feedback_set.all())

    def calcular_distancia(self, latitude_usuario: float, longitude_usuario: float) -> float:
        """
        Calcula a distância em quilômetros entre o ponto de interesse e a posição do usuário
        através da fórmula de Haversine.
        """
        raio_terra = 6371

        lat1 = math.radians(self.latitude)
        lon1 = math.radians(self.longitude)
        lat2 = math.radians(latitude_usuario)
        lon2 = math.radians(longitude_usuario)

        dlat = lat2 - lat1
        dlon = lon2 - lon1

        a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distancia = raio_terra * c

        return distancia

    @classmethod
    def criar_ponto_de_interesse(cls, nome: str, tipo: str, categoria: str, endereco: str,
                               latitude: float, longitude: float, descricao: str) -> "PontoDeInteresse":
        ponto = cls(nome=nome, tipo=tipo, categoria=categoria, endereco=endereco,
                    latitude=latitude, longitude=longitude, descricao=descricao)
        ponto.save()
        return ponto

    @classmethod
    def listar_pontos_de_interesse(cls) -> List["PontoDeInteresse"]:
        return cls.objects.all()
        

class Feedback(models.Model):
    ponto_de_interesse = models.ForeignKey("PontoDeInteresse", on_delete=models.CASCADE)
    autor = models.CharField(max_length=100)
    comentario = models.TextField(blank=True)
    nota = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], help_text="Nota de 1 a 5")
    adicionado_em = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.autor} avaliou '{self.ponto_de_interesse.nome if self.ponto_de_interesse else 'Desconhecido'}' com nota {self.nota}"

