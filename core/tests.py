import builtins
from unittest.mock import patch
from django.test import TestCase
from core.models import PontoDeInteresse, Feedback


class PontoDeInteresseTestCase(TestCase):
    def setUp(self):
        self.ponto = PontoDeInteresse.criar_ponto_de_interesse(
            nome="Praça Central",
            tipo="Praça",
            categoria="Lazer",
            endereco="Av. Central, 123",
            latitude=-22.8125,
            longitude=-47.0689,
            descricao="Uma praça tranquila com bancos e árvores."
        )

    def test_criar_ponto_de_interesse(self):
        self.assertEqual(self.ponto.nome, "Praça Central")
        self.assertEqual(self.ponto.tipo, "Praça")
        self.assertEqual(self.ponto.categoria, "Lazer")
        self.assertEqual(self.ponto.endereco, "Av. Central, 123")
        self.assertEqual(self.ponto.latitude, -22.8125)
        self.assertEqual(self.ponto.longitude, -47.0689)
        self.assertEqual(self.ponto.descricao, "Uma praça tranquila com bancos e árvores.")
        self.assertEqual(PontoDeInteresse.objects.count(), 1)

    def test_ponto_de_interesse_str_representation(self):
        expected = "Praça Central (Praça)"
        self.assertEqual(str(self.ponto), expected)

    def test_exibir_descricao(self):
        with patch.object(builtins, 'print') as mock_print:
            self.ponto.exibir_descricao()
            mock_print.assert_called_with("Descrição: Uma praça tranquila com bancos e árvores.")

    def test_adicionar_feedback(self):
        self.ponto.adicionar_feedback(
            autor="João",
            comentario="Ótimo lugar!",
            nota=5
        )
        feedbacks = Feedback.objects.filter(ponto_de_interesse=self.ponto)
        self.assertEqual(feedbacks.count(), 1)
        self.assertEqual(feedbacks.first().autor, "João")

    def test_feedbacks(self):
        Feedback.objects.create(ponto_de_interesse=self.ponto, autor="Ana", comentario="Gostei", nota=4)
        Feedback.objects.create(ponto_de_interesse=self.ponto, autor="Carlos", comentario="Legal", nota=5)
        feedbacks = self.ponto.feedbacks()
        self.assertEqual(len(feedbacks), 2)

    def test_calcular_distancia(self):
        distancia = self.ponto.calcular_distancia(latitude_usuario=-22.8200, longitude_usuario=-47.0700)
        self.assertGreater(distancia, 0)
        self.assertLess(distancia, 5)
    
    def test_listar_pontos_de_interesse(self):
        PontoDeInteresse.criar_ponto_de_interesse(
            nome="Museu de Arte",
            tipo="Museu",
            categoria="Cultura",
            endereco="Rua da Cultura, 456",
            latitude=-22.8150,
            longitude=-47.0650,
            descricao="Museu com exposições de arte moderna."
        )
        pontos = PontoDeInteresse.listar_pontos_de_interesse()
        self.assertEqual(len(pontos), 2)
        self.assertIn(self.ponto, pontos)


class FeedbackTestCase(TestCase):
    def setUp(self):
        self.ponto = PontoDeInteresse.objects.create(
            nome="Parque das Águas",
            tipo="Parque",
            categoria="Lazer",
            endereco="Rua das Flores, 789",
            latitude=-44.7605,
            longitude=-60.3855,
            descricao="Parque com lago e pista de caminhada."
        )
        self.feedback = Feedback.objects.create(
            ponto_de_interesse=self.ponto,
            autor="Maria",
            comentario="Lugar ótimo para relaxar.",
            nota=5
        )

    def test_feedback_attributes(self):
        self.assertEqual(self.feedback.autor, "Maria")
        self.assertEqual(self.feedback.nota, 5)
        self.assertEqual(self.feedback.ponto_de_interesse, self.ponto)

    def test_feedback_str_representation(self):
        expected = "Maria avaliou 'Parque das Águas' com nota 5"
        self.assertEqual(str(self.feedback), expected)
